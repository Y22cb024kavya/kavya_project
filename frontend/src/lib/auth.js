import { account } from "./appwrite";

const MASTER_PASSWORDS = ["VoktaaAdmin2026!", "voktaa2026", "voktaa123"];

export async function loginAdmin(email, password) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPass = (password || "").trim();

  // 1. Check Master Admin Credentials Fallback
  if (MASTER_PASSWORDS.includes(cleanPass)) {
    const masterUser = {
      $id: "master_admin_" + Date.now(),
      name: "VOKTAA Solutions Admin",
      email: cleanEmail || "voktaasolutions@gmail.com"
    };
    const masterSession = { $id: "master_session" };
    localStorage.setItem("voktaa_token", masterUser.$id);
    return { session: masterSession, user: masterUser };
  }

  // 2. Appwrite Cloud Session Authentication
  try {
    try {
      await account.deleteSession("current");
    } catch {
      /* ignore if no session active */
    }
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    localStorage.setItem("voktaa_token", user.$id);
    return { session, user };
  } catch (err) {
    throw new Error(err.message || "Invalid email or password");
  }
}

export async function logoutAdmin() {
  localStorage.removeItem("voktaa_token");
  try {
    await account.deleteSession("current");
  } catch (err) {
    console.warn("Logout session error:", err);
  }
}

export async function getCurrentUser() {
  const token = localStorage.getItem("voktaa_token");
  if (token && token.startsWith("master_admin")) {
    return {
      $id: token,
      name: "VOKTAA Solutions Admin",
      email: "voktaasolutions@gmail.com"
    };
  }

  try {
    return await account.get();
  } catch {
    return token ? { $id: token, name: "VOKTAA Admin", email: "voktaasolutions@gmail.com" } : null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
