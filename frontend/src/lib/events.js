function getSessionId() {
  let id = localStorage.getItem("voktaa_sid");
  if (!id) {
    id = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("voktaa_sid", id);
  }
  return id;
}

export async function trackEvent(eventData) {
  const doc = {
    type: eventData.type || "visit",
    category: eventData.category || "",
    label: (eventData.label || "").slice(0, 500),
    page: eventData.page || window.location.pathname,
    session_id: eventData.session_id || getSessionId(),
    timestamp: new Date().toISOString(),
  };

  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    await fetch(`${backendUrl}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    });
  } catch (err) {
    /* silent tracking catch */
  }
}

export function trackVisit(page) {
  trackEvent({ type: "visit", page }).catch(() => {});
}

export function trackClick(category, label, page = window.location.pathname) {
  trackEvent({ type: "click", category, label, page }).catch(() => {});
}

export async function getAnalyticsData() {
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const token = localStorage.getItem("voktaa_token");
    if (token) {
      const res = await fetch(`${backendUrl}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        return await res.json();
      }
    }
  } catch (err) {
    console.error("Analytics computation error:", err);
  }

  return {
    totals: { visits: 0, unique_visitors: 0, submissions: 0, contact_clicks: 0, total_clicks: 0 },
    visits_over_time: [],
    page_views: [],
    program_breakdown: [],
    program_clicks: [],
    recent_enquiries: [],
  };
}
