import { databases, DATABASE_ID, COLLECTIONS, ID, Query, withCollectionFallback } from "./appwrite";

const INITIAL_FALLBACK_REVIEWS = [
  { id: "r1", name: "Tejasri Penubothu", role: "Student", organisation: "Student", program: "Soft Skills Development", rating: 5, review: "I started using VOKTAA Solutions last week to improve my communication skills, leadership qualities, and interview skills. The training sessions are engaging, well-organized, and easy to understand. The trainers explain every concept clearly with practical examples, which has helped me build confidence. Whenever I had a question, the support team responded quickly and was very helpful. Overall, it has been a great learning experience, and I highly recommend VOKTAA Solutions to anyone looking to improve their soft skills.", status: "approved" },
  { id: "r2", name: "Sahithi Srinivas S", role: "Student", organisation: "Student", program: "Campus Recruitment Training", rating: 5, review: "I started using VOKTAA Solutions last week to fix my communication skills, leadership qualities and Interview Tips. The app is very clean and fast. When I had a question, their online/offline sessions helped my interviews and the support team replied in minutes. Highly recommend.", status: "approved" },
  { id: "r3", name: "N Venkata Bhargavi", role: "Student", organisation: "Student", program: "Communication Skills", rating: 5, review: "This session will definitely be useful for those who want to build a strong foundation on communication skills and also boost them with confidence to face the interviews. I learned a lot of tips which helped me in my interviews.", status: "approved" },
  { id: "r4", name: "Anumula Abhinaya", role: "Student", organisation: "Student", program: "Public Speaking & Debate", rating: 5, review: "The session was very useful and interactive. I learned many things that will help me improve my communication and confidence.", status: "approved" }
];

export async function getPublicReviews() {
  try {
    const docs = await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
      const res = await databases.listDocuments(DATABASE_ID, colId, [
        Query.equal("status", "approved"),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ]);
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
        status: d.status,
        timestamp: d.timestamp || d.$createdAt,
      }));
    });
    return docs.length > 0 ? docs : INITIAL_FALLBACK_REVIEWS;
  } catch (err) {
    console.warn("Fetch public reviews error, using fallback:", err);
    return INITIAL_FALLBACK_REVIEWS;
  }
}

export async function submitReview(data) {
  const doc = {
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    role: data.role || "Student",
    organisation: data.organisation || "",
    program: data.program || "",
    rating: Number(data.rating) || 5,
    review: data.review || "",
    status: data.status || "approved",
    timestamp: new Date().toISOString(),
  };

  return await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
    const res = await databases.createDocument(DATABASE_ID, colId, ID.unique(), doc);
    return { id: res.$id, ...res };
  });
}

export async function getAllReviewsAdmin() {
  return await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
    const res = await databases.listDocuments(DATABASE_ID, colId, [
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]);
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
  return await withCollectionFallback(COLLECTIONS.REVIEWS, "reviews", async (colId) => {
    await databases.deleteDocument(DATABASE_ID, colId, id);
    return true;
  });
}
