import { databases, DATABASE_ID, COLLECTIONS, ID, Query, withCollectionFallback } from "./appwrite";

const INITIAL_LOCAL_ENQUIRIES = [
  {
    id: "enq_1789574067",
    first_name: "kavya",
    last_name: "R.V.R & J.C College Of Engineering",
    email: "kavyagowripatnam@gmail.com",
    phone: "+916281803434",
    program: "Soft Skills Development",
    city: "KAKINADA",
    message: "hii",
    timestamp: "2026-09-16T15:51:30.000Z",
  }
];

export function getLocalEnquiries() {
  try {
    const raw = localStorage.getItem("voktaa_local_enquiries");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Seed default baseline enquiry if empty
    localStorage.setItem("voktaa_local_enquiries", JSON.stringify(INITIAL_LOCAL_ENQUIRIES));
    return INITIAL_LOCAL_ENQUIRIES;
  } catch {
    return INITIAL_LOCAL_ENQUIRIES;
  }
}

export function saveLocalEnquiry(enquiry) {
  try {
    const existing = getLocalEnquiries();
    const enquiryId = enquiry.id || "enq_" + Date.now();
    const formatted = { id: enquiryId, ...enquiry };
    const exists = existing.some(
      (e) => (e.id && e.id === enquiryId) || (e.email === enquiry.email && e.message === enquiry.message && e.first_name === enquiry.first_name)
    );
    if (!exists) {
      existing.unshift(formatted);
      localStorage.setItem("voktaa_local_enquiries", JSON.stringify(existing));
    }
  } catch (err) {
    console.warn("Local storage enquiry save notice:", err);
  }
}

export async function createEnquiry(data) {
  const doc = {
    id: "enq_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    first_name: (data.first_name || "").slice(0, 250),
    last_name: (data.last_name || "").slice(0, 250),
    email: (data.email || "").slice(0, 250),
    phone: (data.phone || "").slice(0, 50),
    program: (data.program || "").slice(0, 250),
    city: (data.city || "").slice(0, 250),
    message: (data.message || "").slice(0, 1900),
    timestamp: new Date().toISOString(),
  };

  // 1. Save to LocalStorage immediately so it is NEVER lost on client
  saveLocalEnquiry(doc);

  // 2. Try saving to backend API if configured
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    if (backendUrl) {
      await fetch(`${backendUrl}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
    }
  } catch (backendErr) {
    console.warn("Backend API enquiry save notice:", backendErr);
  }

  // 3. Try saving to Appwrite Cloud
  try {
    await withCollectionFallback(COLLECTIONS.ENQUIRIES, "enquiries", async (colId) => {
      const res = await databases.createDocument(DATABASE_ID, colId, ID.unique(), doc);
      if (res && res.$id) doc.id = res.$id;
    });
  } catch (appwriteErr) {
    console.warn("Appwrite db save notice:", appwriteErr);
  }

  return doc;
}

export async function getEnquiries() {
  let appwriteDocs = [];
  let backendDocs = [];

  // 1. Fetch from Appwrite Cloud
  try {
    appwriteDocs = await withCollectionFallback(COLLECTIONS.ENQUIRIES, "enquiries", async (colId) => {
      let res;
      try {
        res = await databases.listDocuments(DATABASE_ID, colId, [
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ]);
      } catch {
        res = await databases.listDocuments(DATABASE_ID, colId, [Query.limit(100)]);
      }

      return (res.documents || []).map((d) => ({
        id: d.$id,
        first_name: d.first_name,
        last_name: d.last_name,
        email: d.email,
        phone: d.phone,
        program: d.program,
        city: d.city,
        message: d.message,
        timestamp: d.timestamp || d.$createdAt,
      }));
    });
  } catch (err) {
    console.warn("Fetch Appwrite enquiries notice:", err);
  }

  // 2. Fetch from Backend API
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const token = localStorage.getItem("voktaa_token");
    if (backendUrl && token) {
      const res = await fetch(`${backendUrl}/api/admin/enquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        backendDocs = await res.json();
      }
    }
  } catch (err) {
    console.warn("Fetch backend enquiries notice:", err);
  }

  // 3. Fetch from LocalStorage
  const localDocs = getLocalEnquiries();

  // Combine all sources & deduplicate
  const combined = [...(appwriteDocs || []), ...(backendDocs || []), ...(localDocs || [])];

  const seenKeys = new Set();
  const uniqueEnquiries = [];

  for (const item of combined) {
    if (!item) continue;
    const email = item.email || "";
    const name = (item.first_name || "") + " " + (item.last_name || "");
    const key = item.id || `${email}_${item.timestamp}_${name}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueEnquiries.push({
        id: item.id || key,
        first_name: item.first_name || item.name || "",
        last_name: item.last_name || "",
        email: item.email || "",
        phone: item.phone || "",
        program: item.program || item.programme || "General Enquiry",
        city: item.city || "",
        message: item.message || "",
        timestamp: item.timestamp || item.$createdAt || item.created_at || new Date().toISOString(),
      });
    }
  }

  // Sort descending by timestamp
  uniqueEnquiries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return uniqueEnquiries;
}
