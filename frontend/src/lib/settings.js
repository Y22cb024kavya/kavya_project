const DEFAULT_SETTINGS = { reviews_visible: true };

export async function getSiteSettings() {
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const res = await fetch(`${backendUrl}/api/settings`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Fetch settings error, using default:", err);
  }
  return DEFAULT_SETTINGS;
}

export async function updateSiteSettings(newSettings) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
  const token = localStorage.getItem("voktaa_token");
  if (token) {
    const res = await fetch(`${backendUrl}/api/admin/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newSettings),
    });

    if (res.ok) {
      return await res.json();
    }
  }
  return { ...DEFAULT_SETTINGS, ...newSettings };
}
