from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import asyncio
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

import jwt
import bcrypt
import resend
# COMMENTED OUT TO FIX MODULE ERROR:
# from emergentintegrations.llm.chat import LlmChat, UserMessage
from bson import ObjectId
from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, BeforeValidator, ConfigDict

# ------------------------------------------------------------------ DB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ------------------------------------------------------------------ App
app = FastAPI(title="VOKTAA Solutions API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("voktaa")

# ------------------------------------------------------------------ Helpers
PyObjectId = Annotated[str, BeforeValidator(str)]

JWT_ALGORITHM = "HS256"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


async def send_enquiry_email(enquiry: dict) -> None:
    """Notify the site owner of a new enquiry. Never blocks/fails the request."""
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    owner = os.environ.get("OWNER_EMAIL", "").strip()
    if not api_key or not owner:
        return
    try:
        resend.api_key = api_key
        rows = "".join(
            f"<tr><td style='padding:6px 12px;color:#6b7280;font-size:13px'>{k.replace('_',' ').title()}</td>"
            f"<td style='padding:6px 12px;color:#111827;font-size:13px'>{enquiry.get(k) or '-'}</td></tr>"
            for k in ["first_name", "last_name", "email", "phone", "program", "city", "message"]
        )
        html = (
            "<div style='font-family:Arial,sans-serif;max-width:560px;margin:auto'>"
            "<div style='background:#071527;padding:24px 20px'>"
            "<span style='color:#D9A23B;font-weight:bold;font-size:20px;letter-spacing:3px'>VOKTAA</span>"
            "<p style='color:#F2C46D;font-size:12px;margin:6px 0 0'>NEW DEMO ENQUIRY</p></div>"
            "<div style='border:1px solid #eee;border-top:3px solid #D9A23B;padding:8px'>"
            f"<table style='width:100%;border-collapse:collapse'>{rows}</table></div>"
            "<p style='color:#9ca3af;font-size:11px;padding:12px 20px'>Sent automatically from voktaasolutions.com</p></div>"
        )
        params = {
            "from": os.environ.get("SENDER_EMAIL", "onboarding@resend.dev"),
            "to": [owner],
            "subject": f"New Enquiry: {enquiry.get('first_name','')} · {enquiry.get('program') or 'General'}",
            "html": html,
        }
        await asyncio.to_thread(resend.Emails.send, params)
    except Exception as e:  # noqa
        logger.error("Enquiry email failed: %s", e)


async def get_current_admin(request: Request) -> dict:
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {"id": str(user["_id"]), "email": user["email"], "role": user.get("role", "admin")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ------------------------------------------------------------------ Models
class LoginInput(BaseModel):
    email: EmailStr
    password: str


class EnquiryCreate(BaseModel):
    first_name: str
    last_name: str = ""
    email: EmailStr
    phone: str = ""
    program: str = ""
    city: str = ""
    message: str = ""


class TrackEvent(BaseModel):
    type: str                       # "visit" | "click"
    category: str = ""              # "contact" | "cta" | "program" | "nav"
    label: str = ""                 # e.g. "whatsapp", "Little Voices"
    page: str = ""
    session_id: str = ""


class ReviewCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    role: str = ""
    organisation: str = ""
    program: str = ""
    rating: int = 5
    review: str


class ReviewStatusUpdate(BaseModel):
    status: str  # "approved" | "rejected" | "pending"


class ChatMessage(BaseModel):
    session_id: str
    message: str


VOKTAA_SYSTEM_PROMPT = """You are the VOKTAA Solutions website assistant. VOKTAA is a Corporate Learning and Employability Solutions company based in Guntur, Andhra Pradesh, India, founded by P. Raja Sekhar.
Contact: +91 74161 13199 | voktaasolutions@gmail.com | www.voktaa.com

Answer questions about:

PROGRAMS (11 total):
1. Campus Recruitment Training (CRT) - interview skills, GD, workplace communication for final-year engineering students
2. Soft Skills Development - communication, teamwork for college students
3. Communication Skills & Business Communication - professional writing, presentations, verbal communication
4. Personality Development - confidence, body language, self-presentation
5. Public Speaking & Debate - structured speaking practice for school and college students
6. Interview Skills - mock interviews, real-time feedback
7. Career Guidance - career pathways, aptitude guidance
8. Leadership Development - team management, decision-making
9. Corporate Training - customised sessions for HR teams and employees
10. Faculty Development - classroom delivery for educators
11. Train-the-Trainer - equipping L&D teams

ABOUT THE COMPANY:
- Founded by P. Raja Sekhar, Assistant Professor and certified Soft Skills Trainer
- Vision: Become India's most trusted Corporate Learning and Employability Solutions organisation
- Tagline: Speak. Shine. Succeed.
- Training culture, not tuition culture
- Serves: Engineering colleges, degree colleges, universities, corporate HR teams, government agencies
- Locations served: Guntur, Vijayawada, Vizag and across AP

CONTACT & BOOKING:
- Phone/WhatsApp: +91 74161 13199
- Email: voktaasolutions@gmail.com
- Website: www.voktaa.com
- Book a demo: fill form at www.voktaa.com/contact

RULES:
- Always be helpful, warm, and professional
- If asked about fees or schedules, say contact the team directly as programmes are customised per institution
- If asked something unrelated to VOKTAA, politely say you can only help with VOKTAA-related questions and suggest they contact the team directly
- Keep answers concise and friendly (2-4 short sentences)
- Always end responses with an invitation to contact the team or book a free demo if relevant
- Never make up information not listed above"""


# ------------------------------------------------------------------ Auth routes
@api_router.post("/auth/login")
async def login(data: LoginInput):
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(str(user["_id"]), email)
    return {"token": token, "user": {"email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin")}}


@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return admin


# ------------------------------------------------------------------ Public routes
@api_router.get("/")
async def root():
    return {"message": "VOKTAA Solutions API"}


@api_router.post("/track")
async def track(event: TrackEvent, request: Request):
    doc = event.model_dump()
    doc["timestamp"] = now_iso()
    doc["ip"] = request.client.host if request.client else ""
    await db.events.insert_one(doc)
    return {"ok": True}


@api_router.post("/enquiries")
async def create_enquiry(data: EnquiryCreate, request: Request):
    doc = data.model_dump()
    doc["timestamp"] = now_iso()
    doc["ip"] = request.client.host if request.client else ""
    res = await db.enquiries.insert_one(doc)
    # also record as a submission event for analytics
    await db.events.insert_one({
        "type": "submission", "category": "enquiry", "label": data.program,
        "page": "/contact", "session_id": "", "timestamp": now_iso(),
    })
    await send_enquiry_email(doc)
    return {"ok": True, "id": str(res.inserted_id)}


@api_router.post("/chat")
async def chat_with_bot(payload: ChatMessage):
    """AI chatbot answering VOKTAA-only questions using Claude via Emergent LLM key."""
    llm_key = os.environ.get("EMERGENT_LLM_KEY", "").strip()
    if not llm_key:
        raise HTTPException(status_code=503, detail="Chat is not configured.")
    text = (payload.message or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty message.")
    if len(text) > 2000:
        text = text[:2000]
    try:
        # COMMENTED OUT TO FIX MODULE ERROR:
        # chat = LlmChat(
        #     api_key=llm_key,
        #     session_id=payload.session_id or "voktaa-web",
        #     system_message=VOKTAA_SYSTEM_PROMPT,
        # ).with_model("anthropic", "claude-sonnet-4-5")
        # reply = await chat.send_message(UserMessage(text=text))
        
        # ADDED PLACEHOLDER REPLY:
        reply = "Chat is temporarily disabled."
        
        # persist a lightweight log for analytics
        await db.events.insert_one({
            "type": "click", "category": "chat", "label": text[:120],
            "page": "/chat", "session_id": payload.session_id or "",
            "timestamp": now_iso(),
        })
        return {"reply": str(reply)}
    except Exception as e:
        logger.error("chat error: %s", e)
        raise HTTPException(status_code=502, detail="chat_unavailable")


# ------------------------------------------------------------------ Admin routes
@api_router.get("/admin/enquiries")
async def list_enquiries(admin: dict = Depends(get_current_admin)):
    items = await db.enquiries.find().sort("timestamp", -1).to_list(500)
    for it in items:
        it["id"] = str(it.pop("_id"))
    return items


# ---------------- Reviews ----------------
@api_router.post("/reviews")
async def submit_review(data: ReviewCreate, request: Request):
    if not data.review or len(data.review.strip()) < 5:
        raise HTTPException(status_code=400, detail="Review is too short.")
    doc = data.model_dump()
    doc["rating"] = max(1, min(5, int(doc.get("rating") or 5)))
    doc["status"] = "approved"
    doc["timestamp"] = now_iso()
    doc["ip"] = request.client.host if request.client else ""
    await db.reviews.insert_one(doc)
    await db.events.insert_one({
        "type": "submission", "category": "review", "label": data.program or data.role,
        "page": "/reviews", "session_id": "", "timestamp": now_iso(),
    })
    return {"ok": True, "message": "Thanks! Your review is now live on the site."}


@api_router.get("/reviews")
async def public_reviews(limit: int = 100):
    limit = max(1, min(200, limit))
    items = await db.reviews.find({"status": "approved"}).sort("timestamp", -1).to_list(limit)
    for it in items:
        it["id"] = str(it.pop("_id"))
        # never expose email/ip publicly
        it.pop("email", None)
        it.pop("ip", None)
        it.pop("phone", None)
    return items


@api_router.get("/admin/reviews")
async def admin_reviews(admin: dict = Depends(get_current_admin)):
    items = await db.reviews.find().sort("timestamp", -1).to_list(500)
    for it in items:
        it["id"] = str(it.pop("_id"))
    return items


@api_router.patch("/admin/reviews/{review_id}")
async def update_review_status(review_id: str, body: ReviewStatusUpdate, admin: dict = Depends(get_current_admin)):
    if body.status not in {"approved", "rejected", "pending"}:
        raise HTTPException(status_code=400, detail="Invalid status")
    try:
        oid = ObjectId(review_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid id")
    res = await db.reviews.update_one({"_id": oid}, {"$set": {"status": body.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"ok": True}


@api_router.delete("/admin/reviews/{review_id}")
async def delete_review(review_id: str, admin: dict = Depends(get_current_admin)):
    try:
        oid = ObjectId(review_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid id")
    await db.reviews.delete_one({"_id": oid})
    return {"ok": True}


# ---------------- Site settings (public read, admin write) ----------------
DEFAULT_SETTINGS = {"reviews_visible": True}


async def get_settings_doc() -> dict:
    doc = await db.settings.find_one({"_id": "site"}) or {}
    out = dict(DEFAULT_SETTINGS)
    for k, v in doc.items():
        if k != "_id":
            out[k] = v
    return out


@api_router.get("/settings")
async def public_settings():
    return await get_settings_doc()


@api_router.patch("/admin/settings")
async def update_settings(body: dict, admin: dict = Depends(get_current_admin)):
    allowed = {k: bool(v) if isinstance(DEFAULT_SETTINGS.get(k), bool) else v for k, v in body.items() if k in DEFAULT_SETTINGS}
    if not allowed:
        raise HTTPException(status_code=400, detail="No valid settings")
    await db.settings.update_one({"_id": "site"}, {"$set": allowed}, upsert=True)
    return await get_settings_doc()


@api_router.get("/admin/analytics")
async def analytics(admin: dict = Depends(get_current_admin)):
    total_visits = await db.events.count_documents({"type": "visit"})
    submissions = await db.enquiries.count_documents({})
    contact_clicks = await db.events.count_documents({"type": "click", "category": "contact"})
    total_clicks = await db.events.count_documents({"type": "click"})

    unique_ids = await db.events.distinct("session_id", {"type": "visit", "session_id": {"$ne": ""}})
    unique_visitors = len([x for x in unique_ids if x])

    # program breakdown from enquiries
    program_pipeline = [
        {"$match": {"program": {"$ne": ""}}},
        {"$group": {"_id": "$program", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    program_rows = await db.enquiries.aggregate(program_pipeline).to_list(50)
    program_breakdown = [{"program": r["_id"], "count": r["count"]} for r in program_rows]

    # program interest clicks
    click_pipeline = [
        {"$match": {"type": "click", "category": "program"}},
        {"$group": {"_id": "$label", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    click_rows = await db.events.aggregate(click_pipeline).to_list(50)
    program_clicks = [{"program": r["_id"], "count": r["count"]} for r in click_rows]

    # visits over last 14 days
    days = []
    today = datetime.now(timezone.utc).date()
    for i in range(13, -1, -1):
        d = today - timedelta(days=i)
        start = datetime(d.year, d.month, d.day, tzinfo=timezone.utc).isoformat()
        end = (datetime(d.year, d.month, d.day, tzinfo=timezone.utc) + timedelta(days=1)).isoformat()
        c = await db.events.count_documents({"type": "visit", "timestamp": {"$gte": start, "$lt": end}})
        days.append({"date": d.strftime("%b %d"), "visits": c})

    # page views breakdown
    page_pipeline = [
        {"$match": {"type": "visit"}},
        {"$group": {"_id": "$page", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    page_rows = await db.events.aggregate(page_pipeline).to_list(50)
    page_views = [{"page": r["_id"] or "/", "count": r["count"]} for r in page_rows]

    recent = await db.enquiries.find().sort("timestamp", -1).to_list(10)
    for it in recent:
        it["id"] = str(it.pop("_id"))

    return {
        "totals": {
            "visits": total_visits,
            "unique_visitors": unique_visitors,
            "submissions": submissions,
            "contact_clicks": contact_clicks,
            "total_clicks": total_clicks,
        },
        "program_breakdown": program_breakdown,
        "program_clicks": program_clicks,
        "visits_over_time": days,
        "page_views": page_views,
        "recent_enquiries": recent,
    }


# ------------------------------------------------------------------ Startup
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "P. Raja Sekhar",
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info("Admin seeded: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated: %s", admin_email)


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.events.create_index("type")
    await seed_admin()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)