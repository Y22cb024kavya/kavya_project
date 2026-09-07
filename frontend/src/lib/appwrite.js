import { Client, Account, Databases, Storage, ID, Query } from "appwrite";

const ENDPOINT = process.env.REACT_APP_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = process.env.REACT_APP_APPWRITE_PROJECT_ID || "6a9e59b9002ac470300e";

export const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { ID, Query };

export const DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID || "6a9e62d20038b6046ebf";
export const BUCKET_ID = process.env.REACT_APP_APPWRITE_BUCKET_ID || "media_uploads";

export const COLLECTIONS = {
  ENQUIRIES: process.env.REACT_APP_APPWRITE_ENQUIRIES_COLLECTION_ID || "6a9e62ea003a27aa71c1",
  REVIEWS: process.env.REACT_APP_APPWRITE_REVIEWS_COLLECTION_ID || "6a9e62fb00317d9891d4",
  EVENTS: process.env.REACT_APP_APPWRITE_EVENTS_COLLECTION_ID || "6a9e63060029f529bdb4",
  SETTINGS: process.env.REACT_APP_APPWRITE_SETTINGS_COLLECTION_ID || "6a9e6315000d58b0186e",
};

// Helper for database operations with fallback to collection name
export async function withCollectionFallback(primaryCollectionId, fallbackName, fn) {
  try {
    return await fn(primaryCollectionId);
  } catch (err) {
    if (err?.code === 404 || err?.message?.includes("could not be found")) {
      return await fn(fallbackName);
    }
    throw err;
  }
}
