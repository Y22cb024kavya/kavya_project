import { databases, DATABASE_ID, COLLECTIONS, ID, Query, withCollectionFallback } from "./appwrite";

const INITIAL_FALLBACK_REVIEWS = [
  { id: "r1", name: "Tejasri Penubothu", role: "Student", organisation: "Student", program: "Soft Skills Development", rating: 5, review: "I started using VOKTAA Solutions last week to improve my communication skills, leadership qualities, and interview skills. The training sessions are engaging, well-organized, and easy to understand. The trainers explain every concept clearly with practical examples, which has helped me build confidence. Whenever I had a question, the support team responded quickly and was very helpful. Overall, it has been a great learning experience, and I highly recommend VOKTAA Solutions to anyone looking to improve their soft skills.", status: "approved" },
  { id: "r2", name: "Sahithi Srinivas S", role: "Student", organisation: "Student", program: "Campus Recruitment Training", rating: 5, review: "I started using VOKTAA Solutions last week to fix my communication skills, leadership qualities and Interview Tips. The app is very clean and fast. When I had a question, their online/offline sessions helped my interviews and the support team replied in minutes. Highly recommend.", status: "approved" },
  { id: "r3", name: "N Venkata Bhargavi", role: "Student", organisation: "Student", program: "Communication Skills", rating: 5, review: "This session will definitely be useful for those who want to build a strong foundation on communication skills and also boost them with confidence to face the interviews. I learned a lot of tips which helped me in my interviews.", status: "approved" },
  { id: "r4", name: "Anumula Abhinaya", role: "Student", organisation: "Student", program: "Public Speaking & Debate", rating: 5, review: "The session was very useful and interactive. I learned many things that will help me improve my communication and confidence.", status: "approved" }
];

function getLocalReviews() {
  try {
    const raw = localStorage.getItem("voktaa_local_reviews");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReview(review) {
  try {
    const existing = getLocalReviews();
    existing.unshift(review);
    localStorage.setItem("voktaa_local_reviews", JSON.stringify(existing));
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
  let appwriteDocs = [];
  try {
    appwriteDocs = await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
      let res;
      try {
        res = await databases.listDocuments(DATABASE_ID, colId, [
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ]);
      } catch (qErr) {
        console.warn("Appwrite query failed, trying unindexed list fallback:", qErr);
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

  const localDocs = getLocalReviews();
  const dynamicReviews = [...(appwriteDocs || []), ...localDocs].filter(isRealReview);

  // Deduplicate by ID and ensure the 4 core baseline reviews are ALWAYS preserved
  const dynamicIds = new Set(dynamicReviews.map((d) => d.id));
  const coreFallbacks = INITIAL_FALLBACK_REVIEWS.filter((f) => !dynamicIds.has(f.id));

  return [...dynamicReviews, ...coreFallbacks];
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

  try {
    return await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
      const res = await databases.createDocument(DATABASE_ID, colId, ID.unique(), doc);
      return { id: res.$id, ...res };
    });
  } catch (appwriteErr) {
    console.warn("Appwrite review save warning (saved locally):", appwriteErr);
    return localDoc;
  }
}

export async function getAllReviewsAdmin() {
  return await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
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
}

export async function updateReviewStatus(id, status) {
  return await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
    const res = await databases.updateDocument(DATABASE_ID, colId, id, { status });
    return { id: res.$id, ...res };
  });
}

export async function deleteReview(id) {
  try {
    const local = getLocalReviews().filter((r) => r.id !== id);
    localStorage.setItem("voktaa_local_reviews", JSON.stringify(local));
  } catch {
    /* silent storage cleanup */
  }

  return await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
    await databases.deleteDocument(DATABASE_ID, colId, id);
    return true;
  });
}
