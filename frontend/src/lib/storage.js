import { storage, BUCKET_ID, ID } from "./appwrite";

const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "pdf"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function uploadMedia(file) {
  if (!file) throw new Error("No file provided.");
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("File size exceeds maximum allowed limit of 10 MB.");
  }

  const ext = file.name.split(".").pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`File extension '.${ext}' is not allowed.`);
  }

  const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
  const fileUrl = storage.getFileView(BUCKET_ID, res.$id);
  return {
    ok: true,
    key: res.$id,
    url: fileUrl.toString(),
  };
}

export function getMediaViewUrl(fileId) {
  if (!fileId) return "";
  return storage.getFileView(BUCKET_ID, fileId).toString();
}

export async function deleteMedia(fileId) {
  if (!fileId) return false;
  await storage.deleteFile(BUCKET_ID, fileId);
  return true;
}
