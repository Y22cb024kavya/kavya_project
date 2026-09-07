import { databases, DATABASE_ID, COLLECTIONS, ID, Query, withCollectionFallback } from "./appwrite";
import { getEnquiries } from "./enquiries";

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
    await withCollectionFallback(COLLECTIONS.EVENTS, "events", async (colId) => {
      await databases.createDocument(DATABASE_ID, colId, ID.unique(), doc);
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
    const [events, enquiries] = await Promise.all([
      withCollectionFallback(COLLECTIONS.EVENTS, "events", async (colId) => {
        const res = await databases.listDocuments(DATABASE_ID, colId, [
          Query.orderDesc("$createdAt"),
          Query.limit(500),
        ]);
        return res.documents || [];
      }).catch(() => []),
      getEnquiries().catch(() => []),
    ]);

    const visits = events.filter((e) => e.type === "visit");
    const clicks = events.filter((e) => e.type === "click");
    const contactClicks = clicks.filter((e) => e.category === "contact");

    const uniqueSessions = new Set(events.map((e) => e.session_id).filter(Boolean));

    // Visits over time (last 14 days)
    const daysMap = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      daysMap[dateStr] = 0;
    }

    visits.forEach((v) => {
      const dateStr = (v.timestamp || v.$createdAt || "").slice(0, 10);
      if (daysMap[dateStr] !== undefined) {
        daysMap[dateStr]++;
      }
    });

    const visits_over_time = Object.keys(daysMap).map((date) => ({
      date,
      visits: daysMap[date],
    }));

    // Page views breakdown
    const pageMap = {};
    visits.forEach((v) => {
      const page = v.page || "/";
      pageMap[page] = (pageMap[page] || 0) + 1;
    });
    const page_views = Object.keys(pageMap).map((page) => ({
      page,
      count: pageMap[page],
    }));

    // Program breakdown from enquiries
    const progMap = {};
    enquiries.forEach((e) => {
      const prog = e.program || "General Enquiry";
      progMap[prog] = (progMap[prog] || 0) + 1;
    });
    const program_breakdown = Object.keys(progMap).map((program) => ({
      program,
      count: progMap[program],
    }));

    // Program clicks
    const progClickMap = {};
    clicks.forEach((c) => {
      if (c.category === "program" || c.category === "cta") {
        const prog = c.label || "General";
        progClickMap[prog] = (progClickMap[prog] || 0) + 1;
      }
    });
    const program_clicks = Object.keys(progClickMap).map((program) => ({
      program,
      count: progClickMap[program],
    }));

    return {
      totals: {
        visits: visits.length,
        unique_visitors: uniqueSessions.size,
        submissions: enquiries.length,
        contact_clicks: contactClicks.length,
        total_clicks: clicks.length,
      },
      visits_over_time,
      page_views,
      program_breakdown,
      program_clicks,
      recent_enquiries: enquiries.slice(0, 10),
    };
  } catch (err) {
    console.error("Analytics computation error:", err);
    return {
      totals: { visits: 0, unique_visitors: 0, submissions: 0, contact_clicks: 0, total_clicks: 0 },
      visits_over_time: [],
      page_views: [],
      program_breakdown: [],
      program_clicks: [],
      recent_enquiries: [],
    };
  }
}
