import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { Eye, EyeOff, Users, Send, MousePointerClick, LogOut, RefreshCw, Download } from "lucide-react";
import { api, authHeaders, clearToken, getToken } from "../lib/api";

const GOLD = "#6C5CE7";
const NAVY = "#1E1B4B";
const PIE_COLORS = ["#6C5CE7", "#1E1B4B", "#8B5CF6", "#A78BFA", "#C4B5FD"];

const Metric = ({ icon: Icon, label, value, sub }) => (
  <div className="card-purple bg-white border border-purple-100 p-6 rounded-2xl shadow-sm" data-testid={`metric-${label.toLowerCase().replace(/\s/g, "-")}`}>
    <div className="flex items-center justify-between">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-purple-900/60">{label}</span>
      <div className="w-9 h-9 flex items-center justify-center bg-purple-100 text-purple-600 rounded-xl"><Icon size={16} /></div>
    </div>
    <div className="font-heading font-bold text-4xl text-purple-950 mt-4 tracking-tight">{value}</div>
    {sub && <p className="font-mono text-[11px] text-purple-900/50 mt-1">{sub}</p>}
  </div>
);

const Panel = ({ title, children }) => (
  <div className="card-purple bg-white border border-purple-100 p-6 rounded-2xl shadow-sm">
    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-purple-950 mb-6">{title}</h3>
    {children}
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ reviews_visible: true });
  const [togglingReviews, setTogglingReviews] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const [analytics, cfg] = await Promise.all([
        api.get("/admin/analytics", { headers: authHeaders() }),
        api.get("/settings").catch(() => ({ data: { reviews_visible: true } })),
      ]);
      setData(analytics.data);
      setSettings(cfg.data);
    } catch (err) {
      if (err.response?.status === 401) {
        clearToken();
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) { navigate("/admin/login"); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    clearToken();
    navigate("/admin/login");
  };

  const toggleReviewsVisible = async () => {
    setTogglingReviews(true);
    try {
      const next = !settings.reviews_visible;
      const { data: updated } = await api.patch(
        "/admin/settings",
        { reviews_visible: next },
        { headers: authHeaders() }
      );
      setSettings(updated);
    } catch { /* silent */ } finally { setTogglingReviews(false); }
  };

  const exportCSV = async () => {
    try {
      const { data: rows } = await api.get("/admin/enquiries", { headers: authHeaders() });
      const cols = ["first_name", "last_name", "email", "phone", "program", "city", "message", "timestamp"];
      const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `voktaa-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      if (err.response?.status === 401) { clearToken(); navigate("/admin/login"); }
    }
  };

  if (loading && !data) {
    return <div className="min-h-screen bg-purple-50/40 flex items-center justify-center font-mono text-purple-950" data-testid="admin-loading">Loading analytics…</div>;
  }
  if (!data) return null;

  const t = data.totals;
  const programData = data.program_breakdown.length ? data.program_breakdown : data.program_clicks.map(p => ({ program: p.program, count: p.count }));

  return (
    <div className="min-h-screen bg-purple-50/30" data-testid="admin-dashboard">
      {/* top bar */}
      <header className="bg-purple-950 border-b border-purple-800/40">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <div>
            <span className="font-heading font-bold text-xl tracking-[0.18em] text-white">VOKTAA</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-purple-300 ml-3">Analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin/reviews")} className="flex items-center gap-2 text-purple-200 hover:text-white font-mono text-xs uppercase tracking-wider" data-testid="admin-reviews-link">Reviews →</button>
            <button onClick={load} className="flex items-center gap-2 text-purple-200 hover:text-white font-mono text-xs uppercase tracking-wider" data-testid="admin-refresh"><RefreshCw size={14} /> Refresh</button>
            <button onClick={exportCSV} className="flex items-center gap-2 text-purple-200 hover:text-white font-mono text-xs uppercase tracking-wider" data-testid="admin-export-csv"><Download size={14} /> Export CSV</button>
            <button onClick={logout} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl hover:shadow-lg transition-all" data-testid="admin-logout"><LogOut size={14} /> Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <h1 className="font-heading font-bold text-3xl text-purple-950 tracking-tight mb-1">Website Performance</h1>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-900/50 mb-8">Private · Owner Access Only</p>

        {/* SITE CONTROLS */}
        <div className="card-purple bg-white border border-purple-100 p-5 rounded-2xl shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4" data-testid="site-controls">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-purple-900/60">Reviews Section On Website</p>
            <p className="font-heading font-bold text-purple-950 text-lg mt-1">
              {settings.reviews_visible ? "Visible to visitors" : "Hidden from visitors"}
            </p>
          </div>
          <button
            onClick={toggleReviewsVisible}
            disabled={togglingReviews}
            data-testid="toggle-reviews-visible"
            className={`flex items-center gap-2 font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-full transition-colors disabled:opacity-60 ${
              settings.reviews_visible
                ? "bg-navy-deep text-white hover:bg-navy"
                : "bg-gold text-navy-deep hover:bg-gold-light"
            }`}
          >
            {settings.reviews_visible ? <EyeOff size={14} /> : <Eye size={14} />}
            {togglingReviews ? "Saving..." : settings.reviews_visible ? "Hide Reviews" : "Show Reviews"}
          </button>
        </div>

        {/* metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Metric icon={Eye} label="Total Visits" value={t.visits} sub="page views" />
          <Metric icon={Users} label="Unique Visitors" value={t.unique_visitors} sub="distinct sessions" />
          <Metric icon={Send} label="Submissions" value={t.submissions} sub="enquiries" />
          <Metric icon={MousePointerClick} label="Contact Clicks" value={t.contact_clicks} sub="whatsapp / email / phone" />
          <Metric icon={MousePointerClick} label="Total Clicks" value={t.total_clicks} sub="tracked interactions" />
        </div>

        {/* charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Panel title="Visits · Last 14 Days">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.visits_over_time}>
                  <defs>
                    <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e0d5" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }} stroke="#9a9384" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }} stroke="#9a9384" />
                  <Tooltip contentStyle={{ fontFamily: "IBM Plex Mono", fontSize: 12, borderRadius: 4, border: `1px solid ${GOLD}` }} />
                  <Area type="monotone" dataKey="visits" stroke={GOLD} strokeWidth={2.5} fill="url(#gv)" />
                </AreaChart>
              </ResponsiveContainer>
            </Panel>
          </div>

          <Panel title="Program Interest">
            {programData.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={programData} dataKey="count" nameKey="program" cx="50%" cy="50%" outerRadius={95} label={(e) => e.program}>
                    {programData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: "IBM Plex Mono", fontSize: 12, borderRadius: 4 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-ink/50 text-sm py-20 text-center font-mono">No program data yet</p>}
          </Panel>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Panel title="Page Views by Route">
            {data.page_views.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.page_views}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e0d5" vertical={false} />
                  <XAxis dataKey="page" tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }} stroke="#9a9384" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }} stroke="#9a9384" />
                  <Tooltip contentStyle={{ fontFamily: "IBM Plex Mono", fontSize: 12, borderRadius: 4 }} />
                  <Bar dataKey="count" fill={NAVY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-ink/50 text-sm py-20 text-center font-mono">No page views yet</p>}
          </Panel>

          <Panel title="Program Clicks (interest signals)">
            {data.program_clicks.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.program_clicks} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e0d5" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }} stroke="#9a9384" />
                  <YAxis type="category" dataKey="program" width={110} tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }} stroke="#9a9384" />
                  <Tooltip contentStyle={{ fontFamily: "IBM Plex Mono", fontSize: 12, borderRadius: 4 }} />
                  <Bar dataKey="count" fill={GOLD} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-ink/50 text-sm py-20 text-center font-mono">No program clicks yet</p>}
          </Panel>
        </div>

        {/* recent enquiries */}
        <Panel title="Recent Enquiries">
          {data.recent_enquiries.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="recent-enquiries-table">
                <thead>
                  <tr className="text-left font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50 border-b border-black/10">
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Phone</th>
                    <th className="py-3 pr-4">Program</th>
                    <th className="py-3 pr-4">City</th>
                    <th className="py-3">When</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_enquiries.map((e) => (
                    <tr key={e.id} className="border-b border-black/5 text-ink/80">
                      <td className="py-3 pr-4 font-medium text-navy">{e.first_name} {e.last_name}</td>
                      <td className="py-3 pr-4">{e.email}</td>
                      <td className="py-3 pr-4">{e.phone || "-"}</td>
                      <td className="py-3 pr-4">{e.program || "-"}</td>
                      <td className="py-3 pr-4">{e.city || "-"}</td>
                      <td className="py-3 font-mono text-[11px] text-ink/50">{(e.timestamp || "").slice(0, 16).replace("T", " ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-ink/50 text-sm py-10 text-center font-mono">No enquiries yet</p>}
        </Panel>
      </div>
    </div>
  );
};

export default AdminDashboard;
