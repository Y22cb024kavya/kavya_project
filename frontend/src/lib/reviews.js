import { databases, DATABASE_ID, COLLECTIONS, ID, Query, withCollectionFallback } from "./appwrite";

const INITIAL_FALLBACK_REVIEWS = [
  { id: "r1", name: "Tejasri Penubothu", role: "Student", organisation: "Student", program: "Soft Skills Development", rating: 5, review: "I started using VOKTAA Solutions last week to improve my communication skills, leadership qualities, and interview skills. The training sessions are engaging, well-organized, and easy to understand. The trainers explain every concept clearly with practical examples, which has helped me build confidence. Whenever I had a question, the support team responded quickly and was very helpful. Overall, it has been a great learning experience, and I highly recommend VOKTAA Solutions to anyone looking to improve their soft skills.", status: "approved" },
  { id: "r2", name: "Sahithi Srinivas S", role: "Student", organisation: "Student", program: "Campus Recruitment Training", rating: 5, review: "I started using VOKTAA Solutions last week to fix my communication skills, leadership qualities and Interview Tips. The app is very clean and fast. When I had a question, their online/offline sessions helped my interviews and the support team replied in minutes. Highly recommend.", status: "approved" },
  { id: "r3", name: "N Venkata Bhargavi", role: "Student", organisation: "Student", program: "Communication Skills", rating: 5, review: "This session will definitely be useful for those who want to build a strong foundation on communication skills and also boost them with confidence to face the interviews. I learned a lot of tips which helped me in my interviews.", status: "approved" },
  { id: "r4", name: "Anumula Abhinaya", role: "Student", organisation: "Student", program: "Public Speaking & Debate", rating: 5, review: "The session was very useful and interactive. I learned many things that will help me improve my communication and confidence.", status: "approved" },
  { id: "r5", name: "VOKTAA Student", role: "Student", organisation: "Student", program: "Soft Skills & Communication", rating: 5, review: "I joined the program to improve my communication skills, but I gained much more than that. It helped me become more confident, improve my body language, and interact professionally with others.", status: "approved" }
];

function getLocalReviews() {
  try {
    const raw = localStorage.getItem("voktaa_local_reviews");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getDeletedReviewIds() {
  try {
    const raw = localStorage.getItem("voktaa_deleted_reviews");
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveDeletedReviewId(id) {
  if (!id) return;
  try {
    const deleted = getDeletedReviewIds();
    deleted.add(id);
    localStorage.setItem("voktaa_deleted_reviews", JSON.stringify(Array.from(deleted)));
  } catch {
    /* silent storage fallback */
  }
}

function saveLocalReview(review) {
  try {
    const existing = getLocalReviews();
    const reviewId = review.id || "local_" + Date.now();
    const formatted = { id: reviewId, ...review };
    const exists = existing.some(
      (r) => (r.id && r.id === reviewId) || (r.email === review.email && r.review === review.review && r.name === review.name)
    );
    if (!exists) {
      existing.unshift(formatted);
      localStorage.setItem("voktaa_local_reviews", JSON.stringify(existing));
    }
  } catch {
    /* silent storage fallback */
  }
}

const IGNORED_TEST_REVIEWS = new Set(["good", "nice", "test", "demo", "sample", "hii", "hello"]);

function isRealReview(r) {
  if (!r || !r.review) return false;
  const cleaned = r.review.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (IGNORED_TEST_REVIEWS.has(cleaned)) return false;
  if (r.review.trim().length < 5) return false;
  return true;
}

export async function getPublicReviews() {
  let backendDocs = [];
  let appwriteDocs = [];

  // 1. Fetch from Backend Database API
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const res = await fetch(`${backendUrl}/api/reviews`);
    if (res.ok) {
      backendDocs = await res.json();
    }
  } catch (backendErr) {
    console.warn("Fetch backend reviews notice:", backendErr);
  }

  // 2. Fetch from Appwrite Cloud SDK if available
  try {
    appwriteDocs = await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
      let res;
      try {
        res = await databases.listDocuments(DATABASE_ID, colId, [
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ]);
      } catch (qErr) {
        res = await databases.listDocuments(DATABASE_ID, colId, [Query.limit(100)]);
      }

      return (res.documents || [])
        .filter((d) => !d.status || d.status === "approved" || d.status === "pending")
        .map((d) => ({
          id: d.$id,
          name: d.name || "VOKTAA Learner",
          email: d.email || "",
          phone: d.phone || "",
          role: d.role || "Student",
          organisation: d.organisation || "",
          program: d.program || "",
          rating: Number(d.rating) || 5,
          review: d.review || "",
          status: d.status || "approved",
          timestamp: d.timestamp || d.$createdAt,
        }));
    });
  } catch (err) {
    console.warn("Fetch Appwrite public reviews notice:", err);
  }

  // 3. Read Local Storage cache
  const localDocs = getLocalReviews();

  // Combine all sources & deduplicate
  const combined = [...(backendDocs || []), ...(appwriteDocs || []), ...(localDocs || [])];

  const deletedIds = getDeletedReviewIds();
  const seenKeys = new Set();
  const dynamicReviews = [];

  for (const item of combined) {
    if (!isRealReview(item)) continue;
    const key = item.id || `${item.email || item.name}_${(item.review || "").trim()}`;
    if (deletedIds.has(item.id) || deletedIds.has(key)) continue;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      dynamicReviews.push({
        id: item.id || key,
        name: item.name || "VOKTAA Learner",
        email: item.email || "",
        phone: item.phone || "",
        role: item.role || "Student",
        organisation: item.organisation || "",
        program: item.program || "",
        rating: Number(item.rating) || 5,
        review: item.review || "",
        status: item.status || "approved",
        timestamp: item.timestamp || item.created_at || new Date().toISOString(),
      });
    }
  }

  // Preserve core fallback baseline reviews if missing and not deleted
  const dynamicIds = new Set(dynamicReviews.map((d) => d.id));
  const coreFallbacks = INITIAL_FALLBACK_REVIEWS.filter(
    (f) => !dynamicIds.has(f.id) && !deletedIds.has(f.id)
  );

  const allReviews = [...dynamicReviews, ...coreFallbacks];
  allReviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return allReviews;
}

export async function submitReview(data) {
  const doc = {
    name: (data.name || "").slice(0, 250),
    email: (data.email || "").slice(0, 250),
    phone: (data.phone || "").slice(0, 50),
    role: (data.role || "Student").slice(0, 100),
    organisation: (data.organisation || "").slice(0, 250),
    program: (data.program || "").slice(0, 250),
    rating: Number(data.rating) || 5,
    review: (data.review || "").slice(0, 4500),
    status: data.status || "approved",
    timestamp: new Date().toISOString(),
  };

  const localDoc = { id: "local_" + Date.now(), ...doc };
  saveLocalReview(localDoc);

  let createdId = localDoc.id;

  // 1. Submit to Backend Database API (Primary Storage)
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const res = await fetch(`${backendUrl}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    });
    if (res.ok) {
      const resData = await res.json();
      if (resData && resData.id) createdId = resData.id;
    } else {
      const errJson = await res.json().catch(() => ({}));
      console.warn("Backend API submit review response error:", errJson);
    }
  } catch (backendErr) {
    console.warn("Backend API review save warning:", backendErr);
  }

  // 2. Submit to Appwrite Cloud SDK if available
  try {
    await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
      const res = await databases.createDocument(DATABASE_ID, colId, ID.unique(), doc);
      if (res && res.$id) createdId = res.$id;
    });
  } catch (appwriteErr) {
    console.warn("Appwrite review save warning:", appwriteErr);
  }

  return { id: createdId, ...doc };
}

export async function getAllReviewsAdmin() {
  let backendDocs = [];
  let appwriteDocs = [];

  // 1. Fetch from Backend API
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const token = localStorage.getItem("voktaa_token");
    if (token) {
      const res = await fetch(`${backendUrl}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        backendDocs = await res.json();
      }
    }
  } catch (err) {
    console.warn("Fetch backend admin reviews notice:", err);
  }

  // 2. Fetch from Appwrite Cloud
  try {
    appwriteDocs = await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
      let res;
      try {
        res = await databases.listDocuments(DATABASE_ID, colId, [
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ]);
      } catch {
        res = await databases.listDocuments(DATABASE_ID, colId, [Query.limit(100)]);
      }

      return (res.documents || []).map((d) => ({
        id: d.$id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        role: d.role,
        organisation: d.organisation,
        program: d.program,
        rating: Number(d.rating) || 5,
        review: d.review,
        status: d.status || "pending",
        timestamp: d.timestamp || d.$createdAt,
      }));
    });
  } catch (err) {
    console.warn("Fetch Appwrite admin reviews notice:", err);
  }

  const combined = [...(backendDocs || []), ...(appwriteDocs || []), ...getLocalReviews()];
  const deletedIds = getDeletedReviewIds();
  const seen = new Set();
  const result = [];

  for (const item of combined) {
    if (!item) continue;
    const key = item.id || `${item.email}_${(item.review || "").trim()}`;
    if (deletedIds.has(item.id) || deletedIds.has(key)) continue;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({
        id: item.id || key,
        name: item.name || "Anonymous",
        email: item.email || "",
        phone: item.phone || "",
        role: item.role || "Student",
        organisation: item.organisation || "",
        program: item.program || "",
        rating: Number(item.rating) || 5,
        review: item.review || "",
        status: item.status || "pending",
        timestamp: item.timestamp || item.created_at || new Date().toISOString(),
      });
    }
  }

  const currentIds = new Set(result.map((r) => r.id));
  for (const fb of INITIAL_FALLBACK_REVIEWS) {
    if (!currentIds.has(fb.id) && !deletedIds.has(fb.id)) {
      result.push(fb);
    }
  }

  return result;
}

export async function updateReviewStatus(id, status) {
  // Update local storage
  try {
    const local = getLocalReviews();
    const updated = local.map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem("voktaa_local_reviews", JSON.stringify(updated));
  } catch {
    /* silent local update */
  }

  // Update Backend API
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const token = localStorage.getItem("voktaa_token");
    if (token) {
      await fetch(`${backendUrl}/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
    }
  } catch (err) {
    console.warn("Backend API update review status notice:", err);
  }

  // Update Appwrite Cloud
  try {
    return await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
      const res = await databases.updateDocument(DATABASE_ID, colId, id, { status });
      return { id: res.$id, ...res };
    });
  } catch {
    return { id, status };
  }
}

export async function deleteReview(id) {
  saveDeletedReviewId(id);

  // Delete from local storage
  try {
    const local = getLocalReviews().filter((r) => r.id !== id);
    localStorage.setItem("voktaa_local_reviews", JSON.stringify(local));
  } catch {
    /* silent storage cleanup */
  }

  // Delete from Backend API
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const token = localStorage.getItem("voktaa_token");
    if (token) {
      await fetch(`${backendUrl}/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (err) {
    console.warn("Backend API delete review notice:", err);
  }

  // Delete from Appwrite Cloud
  try {
    return await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
      await databases.deleteDocument(DATABASE_ID, colId, id);
      return true;
    });
  } catch {
    return true;
  }
}
