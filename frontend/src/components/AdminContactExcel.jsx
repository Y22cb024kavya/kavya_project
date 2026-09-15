import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet, Download, RefreshCw, Search, Calendar,
  User, Mail, Phone, MapPin, BookOpen, MessageSquare, CheckCircle2
} from "lucide-react";
import { getEnquiries } from "../lib/api";
import { exportToExcel, exportToCSV, formatISTDate } from "../lib/excelExport";

export const AdminContactExcel = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await getEnquiries();
      setEnquiries(data || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Failed to fetch contact enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    // Poll for real-time submission updates every 15 seconds
    const interval = setInterval(fetchEnquiries, 15000);
    return () => clearInterval(interval);
  }, []);

  // Filtered submissions based on search input
  const filteredEnquiries = enquiries.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const fullName = `${item.first_name || ""} ${item.last_name || ""}`.toLowerCase();
    return (
      fullName.includes(q) ||
      (item.email || "").toLowerCase().includes(q) ||
      (item.phone || "").toLowerCase().includes(q) ||
      (item.program || "").toLowerCase().includes(q) ||
      (item.city || "").toLowerCase().includes(q) ||
      (item.message || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="card-purple bg-white border border-purple-100 p-6 rounded-2xl shadow-sm mb-8" data-testid="admin-contact-excel-section">
      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-purple-950">
                Contact Us Data (Excel Sheet View)
              </h3>
              <p className="font-mono text-xs text-purple-900/60 mt-0.5">
                Real-Time Submission History · Auto-Updated
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/30 text-purple-950"
              data-testid="search-contact-excel"
            />
          </div>

          <button
            onClick={fetchEnquiries}
            disabled={loading}
            className="flex items-center gap-2 bg-purple-100 text-purple-800 hover:bg-purple-200 text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            title="Refresh submissions list"
            data-testid="refresh-contact-excel"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => exportToCSV(enquiries)}
            disabled={!enquiries.length}
            className="flex items-center gap-2 bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            data-testid="export-csv-contact"
          >
            <Download size={14} />
            <span>CSV</span>
          </button>

          <button
            onClick={() => exportToExcel(enquiries)}
            disabled={!enquiries.length}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50"
            data-testid="download-excel-contact"
          >
            <FileSpreadsheet size={15} />
            <span>Download Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* METRICS & STATUS BADGE */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-purple-50/50 px-4 py-3 rounded-xl border border-purple-100/80 mb-6 text-xs font-medium text-purple-900/70">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Total Records: <strong className="text-purple-950 font-bold">{enquiries.length} submissions</strong></span>
          {searchTerm && <span className="text-purple-600">({filteredEnquiries.length} matching search)</span>}
        </div>
        {lastRefreshed && (
          <span className="font-mono text-[11px] text-purple-900/50">
            Last Sync: {formatISTDate(lastRefreshed)}
          </span>
        )}
      </div>

      {/* EXCEL SPREADSHEET TABLE */}
      {loading && !enquiries.length ? (
        <div className="py-16 text-center font-mono text-xs text-purple-950 animate-pulse">
          Loading Contact Us Excel data...
        </div>
      ) : filteredEnquiries.length ? (
        <div className="overflow-x-auto rounded-xl border border-purple-200 shadow-inner">
          <table className="w-full text-xs text-left" data-testid="contact-excel-table">
            <thead>
              <tr className="bg-purple-950 text-white font-mono uppercase text-[11px] tracking-wider select-none">
                <th className="py-3 px-3 border-r border-purple-800/60 text-center w-12">Row</th>
                <th className="py-3 px-4 border-r border-purple-800/60">Date & Time (IST)</th>
                <th className="py-3 px-4 border-r border-purple-800/60">Full Name</th>
                <th className="py-3 px-4 border-r border-purple-800/60">Email Address</th>
                <th className="py-3 px-4 border-r border-purple-800/60">Phone</th>
                <th className="py-3 px-4 border-r border-purple-800/60">Programme / Interest</th>
                <th className="py-3 px-4 border-r border-purple-800/60">Location</th>
                <th className="py-3 px-4">Message Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 bg-white">
              {filteredEnquiries.map((row, idx) => {
                const name = `${row.first_name || ""} ${row.last_name || ""}`.trim() || "Anonymous";
                return (
                  <tr
                    key={row.id || idx}
                    onClick={() => setSelectedEnquiry(row)}
                    className="hover:bg-purple-50/70 cursor-pointer transition-colors text-purple-950 group"
                  >
                    <td className="py-3 px-3 text-center font-mono font-bold text-purple-400 bg-purple-50/40 border-r border-purple-100">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-purple-900/70 border-r border-purple-100 whitespace-nowrap">
                      {formatISTDate(row.timestamp || row.$createdAt || row.created_at)}
                    </td>
                    <td className="py-3 px-4 font-bold text-purple-950 border-r border-purple-100 group-hover:text-purple-600">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-purple-400 shrink-0" />
                        <span>{name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 border-r border-purple-100">
                      <div className="flex items-center gap-1.5 text-purple-900">
                        <Mail size={13} className="text-purple-400 shrink-0" />
                        <span className="underline decoration-purple-200">{row.email || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-purple-900 border-r border-purple-100 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-purple-400 shrink-0" />
                        <span>{row.phone || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium border-r border-purple-100">
                      <span className="inline-block bg-purple-100/70 text-purple-900 text-[11px] px-2.5 py-0.5 rounded-md font-semibold">
                        {row.program || "General Enquiry"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-purple-900/80 border-r border-purple-100">
                      {row.city ? (
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-purple-400 shrink-0" />
                          <span>{row.city}</span>
                        </div>
                      ) : "N/A"}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-purple-900/70 italic">
                      {row.message || "No message provided"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center bg-purple-50/30 rounded-xl border border-dashed border-purple-200">
          <FileSpreadsheet size={32} className="mx-auto text-purple-300 mb-2" />
          <p className="font-heading font-bold text-purple-950">No Contact Us submissions found</p>
          <p className="text-xs text-purple-900/60 mt-1 max-w-md mx-auto">
            When users submit the Contact Us form on your website, their submission will automatically appear here as a new row in real time.
          </p>
        </div>
      )}

      {/* SUBMISSION DETAIL MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-purple-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-4 right-4 text-purple-400 hover:text-purple-950 font-mono text-sm"
            >
              ✕ Close
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg text-purple-950">Submission Details</h4>
                <p className="font-mono text-xs text-purple-900/60">
                  {formatISTDate(selectedEnquiry.timestamp || selectedEnquiry.$createdAt)}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div className="bg-purple-50/50 p-3.5 rounded-xl">
                <span className="font-mono text-[10px] uppercase text-purple-900/60 block mb-0.5">Full Name</span>
                <span className="text-sm font-bold text-purple-950">
                  {`${selectedEnquiry.first_name || ""} ${selectedEnquiry.last_name || ""}`.trim() || "Anonymous"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50/50 p-3.5 rounded-xl">
                  <span className="font-mono text-[10px] uppercase text-purple-900/60 block mb-0.5">Email</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-xs font-bold text-purple-600 underline">
                    {selectedEnquiry.email || "N/A"}
                  </a>
                </div>
                <div className="bg-purple-50/50 p-3.5 rounded-xl">
                  <span className="font-mono text-[10px] uppercase text-purple-900/60 block mb-0.5">Phone Number</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-xs font-bold text-purple-950">
                    {selectedEnquiry.phone || "N/A"}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50/50 p-3.5 rounded-xl">
                  <span className="font-mono text-[10px] uppercase text-purple-900/60 block mb-0.5">Programme</span>
                  <span className="text-xs font-bold text-purple-950">
                    {selectedEnquiry.program || "General Enquiry"}
                  </span>
                </div>
                <div className="bg-purple-50/50 p-3.5 rounded-xl">
                  <span className="font-mono text-[10px] uppercase text-purple-900/60 block mb-0.5">City / Location</span>
                  <span className="text-xs font-bold text-purple-950">
                    {selectedEnquiry.city || "N/A"}
                  </span>
                </div>
              </div>

              <div className="bg-purple-50/50 p-3.5 rounded-xl">
                <span className="font-mono text-[10px] uppercase text-purple-900/60 block mb-1">Message Content</span>
                <p className="text-xs text-purple-950 leading-relaxed whitespace-pre-wrap font-normal bg-white p-3 rounded-lg border border-purple-100">
                  {selectedEnquiry.message || "No message provided"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="bg-purple-950 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl hover:bg-purple-900 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactExcel;
