# VOKTAA Solutions — PRD

## Problem Statement
Premium multi-page marketing website for VOKTAA Solutions — a Soft Skills, CRT Training and
Professional Etiquette Training Academy in Andhra Pradesh, India. Founder & CEO: P. RAJA SEKHAR.
Tagline "Speak. Shine. Succeed." Brand line "Every Voice Has An Ascent."

## User Choices
- WhatsApp/phone: 7416113199 (wa.me/917416113199)
- Save contact enquiries to DB + private admin analytics tracker (owner-only)
- Socials: placeholders incl. Threads & Facebook; location city-level (Vijayawada, AP)
- Footer signoff: "Speak · Shine · Succeed"
- Intro line: "Soft Skills, CRT Training and Professional Etiquette Training Academy based in Andhra Pradesh, India."

## Architecture
- Backend: FastAPI + MongoDB (motor). Routes under /api: /track, /enquiries, /auth/login, /auth/me,
  /admin/analytics, /admin/enquiries. JWT (Bearer) admin auth, bcrypt hashing, admin seeded from env.
- Frontend: React + framer-motion + lenis (smooth scroll) + react-fast-marquee + recharts.
  Pages: Home, About, Programs, Contact, /admin/login, /admin.
- Design: navy/gold/ivory, Space Grotesk + Inter + IBM Plex Mono, gold 3px top-border cards,
  dot-grid hero texture, kinetic masked hero reveal, animated ascent SVG curve, scroll reveals.

## Implemented (2025)
- All 4 marketing pages fully built per brief with premium motion.
- Contact enquiry form -> saved to DB, success message.
- Site-wide visit + click event tracking (contact/cta/program).
- Private admin analytics dashboard: totals (visits, unique visitors, submissions, contact clicks,
  total clicks), program interest pie, page views, program clicks, 14-day visits chart, recent enquiries.
- Floating WhatsApp button, mobile drawer, footer, marquee.
- 100% passing backend + frontend automated tests (iteration_1).

## Admin
- /admin/login — voktaasolutions@gmail.com / Voktaa@2025 (see test_credentials.md)

## Backlog / Next
- P1: Email notification to owner on new enquiry (Resend/SendGrid).
- P1: Export enquiries CSV from admin.
- P2: QR-verified certificate generator page.
- P2: Blog / testimonials section for SEO.

## Rebuild (2026)
- Nav expanded: Home, About Us, Programs, For Institutions, Reviews, Contact Us (+ Book a Demo CTA). No Blog.
- Address updated to "Guntur, Andhra Pradesh, India" everywhere.
- New Reviews system: public submission form (5-star rating, role, program), backend `pending → approved` moderation.
- New /admin/reviews (protected) with tabs (pending/approved/rejected/all) + approve/reject/delete + link from analytics dashboard.
- Institutions page (why-choose-us checklist, 5-step engagement, who-we-serve, partner placeholder, CTA).
- Programs page: 11 programme cards + Formats section + CTA.
- New copy across Home (Speak.Shine.Succeed. hero, tag pills, WHO WE ARE, WHY VOKTAA checklist + stats, WHO WE SERVE) and About (acronym, Our Story, Founder's Message, Vision + Mission checklist, 6 Core Values).
- Contact page revised: Guntur, coordinator placeholder, Google Maps embed placeholder.
- Backend added: POST /api/reviews (public), GET /api/reviews (public, approved only, PII stripped), GET/PATCH/DELETE /api/admin/reviews (protected).
- Iteration 3 tests: backend 17/17, frontend 100%.
