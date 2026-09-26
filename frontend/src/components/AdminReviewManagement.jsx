import React, { useEffect, useState } from "react";
import { Check, X, Trash2, Star, MessageSquare, RefreshCw } from "lucide-react";
import { getAllReviewsAdmin, updateReviewStatus, deleteReview } from "../lib/api";
import { toast } from "sonner";

const STATUS_TABS = ["all", "pending", "approved", "rejected"];

const Stars = ({ value }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={14}
        className={i <= value ? "text-amber-500 fill-amber-500" : "text-gray-200"}
      />
    ))}
  </div>
);

const AdminReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviewsAdmin();
      setReviews(data || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateReviewStatus(id, status);
      toast.success(`Review status updated to ${status}`);
      await loadReviews();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleRemoveReview = async (id) => {
    if (!window.confirm("Are you sure you want to permanently remove this review?")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteReview(id);
      toast.success("Review removed successfully from admin side");
      await loadReviews();
    } catch {
      toast.error("Failed to remove review");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = tab === "all" ? reviews : reviews.filter((r) => r.status === tab);

  const counts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="card-purple bg-white border border-purple-100 p-6 rounded-2xl shadow-sm mb-8" data-testid="admin-review-management">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-purple-950">Review Moderation & Removal</h3>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-purple-900/50">
              Manage, approve, reject or permanently remove reviews
            </p>
          </div>
        </div>

        <button
          onClick={loadReviews}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-700 hover:text-purple-950"
          data-testid="admin-reviews-refresh-btn"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh List
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6" data-testid="admin-review-status-tabs">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            data-testid={`admin-tab-${s}`}
            className={`font-mono text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-xl border transition-all ${
              tab === s
                ? "bg-purple-950 text-white border-purple-950 shadow-sm"
                : "bg-purple-50/50 text-purple-900/70 border-purple-100 hover:border-purple-300"
            }`}
          >
            {s} <span className="ml-1 text-purple-400">({counts[s]})</span>
          </button>
        ))}
      </div>

      {/* Review List */}
      {loading ? (
        <div className="py-12 text-center font-mono text-xs text-purple-900/50">Loading reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-purple-100 rounded-xl bg-purple-50/20">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-purple-900/50">No reviews found in this view.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              className="bg-purple-50/30 border border-purple-100/80 p-5 rounded-xl hover:border-purple-200 transition-all"
              data-testid={`admin-review-card-${r.id}`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-bold text-purple-950 text-base">{r.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] bg-white text-purple-900 border border-purple-100 px-2 py-0.5 rounded-md">
                      {r.role || "Learner"}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-md font-bold ${
                        r.status === "approved"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : r.status === "rejected"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-900 border border-amber-200"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="text-purple-900/60 text-xs mt-1">
                    {r.organisation && <span>{r.organisation} · </span>}
                    {r.program && <span>{r.program} · </span>}
                    {r.email && <span className="font-mono">{r.email}</span>}
                    {r.phone && <span> · <span className="font-mono">{r.phone}</span></span>}
                  </p>
                </div>
                <Stars value={r.rating || 5} />
              </div>

              <p className="text-purple-950/90 text-sm mt-3 leading-relaxed bg-white/70 p-3 rounded-lg border border-purple-50">
                "{r.review}"
              </p>

              <div className="flex items-center justify-between gap-3 mt-4 flex-wrap pt-2 border-t border-purple-100/60">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleStatusChange(r.id, "approved")}
                    disabled={r.status === "approved"}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-lg transition-all disabled:opacity-40"
                    data-testid={`admin-approve-btn-${r.id}`}
                  >
                    <Check size={13} /> Approve
                  </button>

                  <button
                    onClick={() => handleStatusChange(r.id, "rejected")}
                    disabled={r.status === "rejected"}
                    className="flex items-center gap-1.5 bg-purple-100 text-purple-900 hover:bg-purple-200 font-bold uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-lg transition-all disabled:opacity-40"
                    data-testid={`admin-reject-btn-${r.id}`}
                  >
                    <X size={13} /> Reject
                  </button>

                  <button
                    onClick={() => handleRemoveReview(r.id)}
                    disabled={deletingId === r.id}
                    className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-lg transition-all disabled:opacity-40 shadow-sm"
                    data-testid={`admin-remove-btn-${r.id}`}
                  >
                    <Trash2 size={13} /> {deletingId === r.id ? "Removing..." : "Remove Review"}
                  </button>
                </div>

                <span className="font-mono text-[10px] text-purple-900/40">
                  {(r.timestamp || "").slice(0, 16).replace("T", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewManagement;
