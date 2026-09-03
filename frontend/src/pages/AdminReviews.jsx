import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Trash2, Star, LogOut, RefreshCw, ArrowLeft } from "lucide-react";
import { api, authHeaders, clearToken, getToken } from "../lib/api";

const STATUS_TABS = ["pending", "approved", "rejected", "all"];

const Stars = ({ v }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={14} className={i <= v ? "text-gold fill-gold" : "text-gold/25"} />
    ))}
  </div>
);

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/reviews", { headers: authHeaders() });
      setReviews(data);
    } catch (err) {
      if (err.response?.status === 401) { clearToken(); navigate("/admin/login"); }
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!getToken()) { navigate("/admin/login"); return; }
    load();
    // eslint-disable-next-line
  }, []);

  const setStatus = async (id, status) => {
    await api.patch(`/admin/reviews/${id}`, { status }, { headers: authHeaders() });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    await api.delete(`/admin/reviews/${id}`, { headers: authHeaders() });
    load();
  };

  const logout = () => { clearToken(); navigate("/admin/login"); };

  const filtered = tab === "all" ? reviews : reviews.filter((r) => r.status === tab);
  const counts = {
    pending: reviews.filter(r => r.status === "pending").length,
    approved: reviews.filter(r => r.status === "approved").length,
    rejected: reviews.filter(r => r.status === "rejected").length,
    all: reviews.length,
  };

  return (
    <div className="min-h-screen bg-ivory" data-testid="admin-reviews">
      <header className="bg-navy-deep border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <div>
            <span className="font-heading font-bold text-xl tracking-[0.18em] bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light">VOKTAA</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 ml-3">Reviews Moderation</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-white/70 hover:text-gold font-mono text-xs uppercase tracking-wider"><ArrowLeft size={14} /> Analytics</button>
            <button onClick={load} className="flex items-center gap-2 text-white/70 hover:text-gold font-mono text-xs uppercase tracking-wider" data-testid="admin-reviews-refresh"><RefreshCw size={14} /> Refresh</button>
            <button onClick={logout} className="flex items-center gap-2 bg-gold text-navy-deep font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl hover:bg-gold-light transition-colors"><LogOut size={14} /> Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <h1 className="font-heading font-bold text-3xl text-navy tracking-tight mb-1">Review Moderation</h1>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50 mb-8">Approve, reject, or remove submitted reviews.</p>

        {/* tabs */}
        <div className="flex flex-wrap gap-2 mb-6" data-testid="admin-reviews-tabs">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              data-testid={`tab-${s}`}
              className={`font-mono text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-xl border transition-colors ${
                tab === s ? "bg-navy-deep text-gold border-navy-deep" : "bg-white text-ink/70 border-black/10 hover:border-gold"
              }`}
            >
              {s} <span className="text-gold ml-1">({counts[s]})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="font-mono text-sm text-ink/50">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="card-gold bg-white border border-black/5 p-10 rounded-xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">No reviews in this state.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <div key={r.id} className="card-gold bg-white border border-black/5 p-6 rounded-xl" data-testid={`admin-review-${r.id}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-heading font-bold text-navy">{r.name}</p>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50 bg-ivory px-2 py-1 rounded-md">{r.role || "—"}</span>
                      <span className={`font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-md ${
                        r.status === "approved" ? "bg-green-100 text-green-800"
                        : r.status === "rejected" ? "bg-red-100 text-red-700"
                        : "bg-gold/20 text-navy-deep"
                      }`}>{r.status}</span>
                    </div>
                    <p className="text-ink/60 text-xs mt-1">
                      {r.organisation || "—"} · {r.program || "—"} · <span className="font-mono">{r.email}</span>
                      {r.phone && <> · <span className="font-mono">{r.phone}</span></>}
                    </p>
                  </div>
                  <Stars v={r.rating || 0} />
                </div>
                <p className="text-ink/85 mt-4 leading-relaxed">{r.review}</p>
                <div className="flex items-center gap-2 mt-5 flex-wrap">
                  <button onClick={() => setStatus(r.id, "approved")} disabled={r.status === "approved"} className="flex items-center gap-1 bg-gold text-navy-deep font-bold uppercase tracking-wider text-[11px] px-4 py-2 rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50" data-testid={`approve-${r.id}`}>
                    <Check size={13} /> Approve
                  </button>
                  <button onClick={() => setStatus(r.id, "rejected")} disabled={r.status === "rejected"} className="flex items-center gap-1 border border-navy text-navy font-bold uppercase tracking-wider text-[11px] px-4 py-2 rounded-xl hover:bg-navy hover:text-white transition-colors disabled:opacity-50" data-testid={`reject-${r.id}`}>
                    <X size={13} /> Reject
                  </button>
                  <button onClick={() => remove(r.id)} className="flex items-center gap-1 text-red-700 font-mono uppercase tracking-wider text-[11px] px-3 py-2 hover:text-red-900" data-testid={`delete-${r.id}`}>
                    <Trash2 size={13} /> Delete
                  </button>
                  <span className="ml-auto font-mono text-[10px] text-ink/40">{(r.timestamp || "").slice(0, 16).replace("T", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
