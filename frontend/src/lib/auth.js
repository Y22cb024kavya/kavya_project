export async function loginAdmin(email, password) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
  let res;

  try {
    res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (netErr) {
    throw new Error(
      "Network connection error: Unable to reach backend API. Please verify server status and network settings."
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      "API routing error: Backend returned non-JSON response. Ensure /api/ is routed to FastAPI backend."
    );
  }

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    if (errJson.detail) {
      throw new Error(errJson.detail);
    }
    if (res.status === 401) {
      throw new Error("Invalid email or password.");
    } else if (res.status === 403) {
      throw new Error("Access denied. Admin privileges required.");
    } else if (res.status === 404) {
      throw new Error("Authentication endpoint not found.");
    } else if (res.status === 422) {
      throw new Error("Invalid email format or missing password.");
    } else if (res.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }
    throw new Error(`Authentication failed (HTTP ${res.status}).`);
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
    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.includes("application/json")) {
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
