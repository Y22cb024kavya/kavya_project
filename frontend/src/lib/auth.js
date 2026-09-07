import { account } from "./appwrite";

export async function loginAdmin(email, password) {
  try {
    // Delete existing session if any to allow fresh login
    try {
      await account.deleteSession("current");
    } catch {
      /* ignore if no session active */
    }
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    return { session, user };
  } catch (err) {
    throw new Error(err.message || "Invalid email or password");
  }
}

export async function logoutAdmin() {
  try {
    await account.deleteSession("current");
  } catch (err) {
    console.warn("Logout session error:", err);
  }
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
