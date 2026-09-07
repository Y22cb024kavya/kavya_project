import { databases, DATABASE_ID, COLLECTIONS, ID, Query, withCollectionFallback } from "./appwrite";

export async function createEnquiry(data) {
  const doc = {
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    email: data.email || "",
    phone: data.phone || "",
    program: data.program || "",
    city: data.city || "",
    message: data.message || "",
    timestamp: new Date().toISOString(),
  };

  return await withCollectionFallback(COLLECTIONS.ENQUIRIES, "enquiries", async (colId) => {
    const res = await databases.createDocument(DATABASE_ID, colId, ID.unique(), doc);
    return { id: res.$id, ...res };
  });
}

export async function getEnquiries() {
  return await withCollectionFallback(COLLECTIONS.ENQUIRIES, "enquiries", async (colId) => {
    const res = await databases.listDocuments(DATABASE_ID, colId, [
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]);
    return (res.documents || []).map((d) => ({
      id: d.$id,
      first_name: d.first_name,
      last_name: d.last_name,
      email: d.email,
      phone: d.phone,
      program: d.program,
      city: d.city,
      message: d.message,
      timestamp: d.timestamp || d.$createdAt,
    }));
  });
}
