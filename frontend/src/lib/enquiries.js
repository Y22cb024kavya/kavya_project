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

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
  const res = await fetch(`${backendUrl}/api/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.detail || "Failed to submit enquiry.");
  }

  return await res.json();
}

export async function getEnquiries() {
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const token = localStorage.getItem("voktaa_token");
    if (token) {
      const res = await fetch(`${backendUrl}/api/admin/enquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        return await res.json();
      }
    }
  } catch (err) {
    console.warn("Fetch backend enquiries notice:", err);
  }

  return [];
}
