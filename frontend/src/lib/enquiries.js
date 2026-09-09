import { databases, DATABASE_ID, COLLECTIONS, ID, Query, withCollectionFallback } from "./appwrite";

export async function createEnquiry(data) {
  const doc = {
    first_name: (data.first_name || "").slice(0, 250),
    last_name: (data.last_name || "").slice(0, 250),
    email: (data.email || "").slice(0, 250),
    phone: (data.phone || "").slice(0, 50),
    program: (data.program || "").slice(0, 250),
    city: (data.city || "").slice(0, 250),
    message: (data.message || "").slice(0, 1900),
    timestamp: new Date().toISOString(),
  };

  return await withCollectionFallback(COLLECTIONS.ENQUIRIES, "enquiries", async (colId) => {
    const res = await databases.createDocument(DATABASE_ID, colId, ID.unique(), doc);
    return { id: res.$id, ...res };
  });
}

export async function getEnquiries() {
  return await withCollectionFallback(COLLECTIONS.ENQUIRIES, "enquiries", async (colId) => {
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
