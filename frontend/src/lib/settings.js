import { databases, DATABASE_ID, COLLECTIONS, ID, Query, withCollectionFallback } from "./appwrite";

const DEFAULT_SETTINGS = { reviews_visible: true };

export async function getSiteSettings() {
  try {
    return await withCollectionFallback(COLLECTIONS.SETTINGS, "settings", async (colId) => {
      const res = await databases.listDocuments(DATABASE_ID, colId, [Query.limit(1)]);
      if (res.documents && res.documents.length > 0) {
        const doc = res.documents[0];
        return {
          id: doc.$id,
          reviews_visible: doc.reviews_visible !== undefined ? doc.reviews_visible : true,
        };
      }
      return DEFAULT_SETTINGS;
    });
  } catch (err) {
    console.warn("Fetch settings error, using default:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(newSettings) {
  return await withCollectionFallback(COLLECTIONS.SETTINGS, "settings", async (colId) => {
    const res = await databases.listDocuments(DATABASE_ID, colId, [Query.limit(1)]);
    if (res.documents && res.documents.length > 0) {
      const existingId = res.documents[0].$id;
      const updated = await databases.updateDocument(DATABASE_ID, colId, existingId, newSettings);
      return { id: updated.$id, ...updated };
    } else {
      const created = await databases.createDocument(DATABASE_ID, colId, ID.unique(), {
        reviews_visible: true,
        ...newSettings,
      });
      return { id: created.$id, ...created };
    }
  });
}
