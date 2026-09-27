export async function loginAdmin(email, password) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
  const res = await fetch(`${backendUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("API routing error: Backend returned non-JSON response. Ensure /api/ is routed to FastAPI backend.");
  }

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.detail || "Invalid email or password");
  }

  const data = await res.json();
  const token = data.access_token || data.token;
  if (token) {
    localStorage.setItem("voktaa_token", token);
  }
  return data;
}

export async function logoutAdmin() {
  localStorage.removeItem("voktaa_token");
}

export async function getCurrentUser() {
  const token = localStorage.getItem("voktaa_token");
  if (!token) return null;

  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const res = await fetch(`${backendUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Fetch current user error:", err);
  }

  return null;
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
