import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "");
export const API = `${BACKEND_URL}/api`;

export const CONTACT = {
  phone: "7416113199",
  phoneDisplay: "+91 74161 13199",
  whatsapp: "917416113199",
  email: "voktaasolutions@gmail.com",
  location: "Guntur, Andhra Pradesh, India",
  website: "www.voktaa.com",
  linkedin: "https://www.linkedin.com/in/voktaa-undefined-6331a8434/",
  instagram: "https://www.instagram.com/voktaasolutions/",
  facebook: "https://www.facebook.com/search/top?q=voktaa%20solutions",
};

export const api = axios.create({ baseURL: API });

// ---- session id for unique visitor tracking ----
function getSessionId() {
  let id = localStorage.getItem("voktaa_sid");
  if (!id) {
    id = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("voktaa_sid", id);
  }
  return id;
}

export function trackVisit(page) {
  api.post("/track", { type: "visit", page, session_id: getSessionId() }).catch(() => {});
}

export function trackClick(category, label, page = window.location.pathname) {
  api.post("/track", { type: "click", category, label, page, session_id: getSessionId() }).catch(() => {});
}

// ---- admin auth token ----
export const getToken = () => localStorage.getItem("voktaa_token");
export const setToken = (t) => localStorage.setItem("voktaa_token", t);
export const clearToken = () => localStorage.removeItem("voktaa_token");

export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
