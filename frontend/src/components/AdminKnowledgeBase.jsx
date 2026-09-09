import React, { useState, useEffect } from "react";
import { Upload, FileText, Trash2, CheckCircle2, AlertCircle, RefreshCw, File, ShieldCheck, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  uploadKnowledgeDocument,
  getKnowledgeDocuments,
  toggleKnowledgeDocument,
  deleteKnowledgeDocument
} from "../lib/api";

const AdminKnowledgeBase = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const list = await getKnowledgeDocuments();
      setDocuments(list || []);
    } catch (err) {
      toast.error("Failed to load knowledge base documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const doc = await uploadKnowledgeDocument(file);
      toast.success(`Uploaded and extracted ${doc.chunksCount} chunks from '${file.name}'`);
      loadDocuments();
    } catch (err) {
      toast.error(err.message || "Failed to upload document.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleToggleActive = async (docId, currentActive) => {
    try {
      await toggleKnowledgeDocument(docId, !currentActive);
      toast.success(!currentActive ? "Document enabled for AI Chatbot" : "Document disabled for AI Chatbot");
      loadDocuments();
    } catch (err) {
      toast.error("Failed to toggle document status.");
    }
  };

  const handleDelete = async (docId, fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete '${fileName}'?`)) return;

    try {
      await deleteKnowledgeDocument(docId, fileId);
      toast.success(`Deleted '${fileName}'`);
      loadDocuments();
    } catch (err) {
      toast.error("Failed to delete document.");
    }
  };

  return (
    <div className="card-purple bg-white border border-purple-100 p-6 md:p-8 rounded-3xl shadow-sm mb-10" data-testid="admin-knowledge-base">
      <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-purple-600 font-bold">AI Chatbot Management</span>
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-950 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              <Sparkles size={10} className="text-purple-600" /> Grounded RAG
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-purple-950 mt-1">Document Knowledge Base</h2>
          <p className="text-sm text-purple-900/70 mt-1">
            Upload PDF, DOCX, or TXT documents. The AI chatbot will use these verified files as its primary source of truth.
          </p>
        </div>

        <button
          onClick={loadDocuments}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-700 hover:text-purple-950 font-bold px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* UPLOAD BOX */}
      <div className="my-8">
        <label className="border-2 border-dashed border-purple-200 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50/80 transition-all duration-300 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer group text-center">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            data-testid="kb-file-input"
          />
          <div className="w-14 h-14 rounded-2xl bg-purple-100 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center transition-colors duration-300 shadow-sm mb-4">
            <Upload size={24} />
          </div>
          <p className="font-heading font-extrabold text-purple-950 text-base">
            {uploading ? "Uploading & Extracting Knowledge Chunks..." : "Click or Drag PDF, DOCX, or TXT Document"}
          </p>
          <p className="text-xs text-purple-900/60 mt-1">
            Allowed file formats: <span className="font-mono text-purple-800 font-bold">.pdf</span>, <span className="font-mono text-purple-800 font-bold">.docx</span>, <span className="font-mono text-purple-800 font-bold">.txt</span>
          </p>
        </label>
      </div>

      {/* DOCUMENT LIST TABLE */}
      <div>
        <h3 className="font-heading font-bold text-lg text-purple-950 mb-4 flex items-center justify-between">
          <span>Active Knowledge Documents ({documents.length})</span>
        </h3>

        {loading ? (
          <div className="py-8 text-center text-sm font-mono text-purple-900/60">Loading Knowledge Documents...</div>
        ) : documents.length === 0 ? (
          <div className="py-10 text-center bg-purple-50/30 rounded-2xl border border-purple-100">
            <FileText size={32} className="mx-auto text-purple-300 mb-2" />
            <p className="font-heading font-bold text-purple-950 text-base">No knowledge documents uploaded yet</p>
            <p className="text-xs text-purple-900/70 mt-1">Upload PDF or DOCX files above to empower the AI Chatbot.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const isActive = doc.isActive !== false;
              const docId = doc.id || doc.$id;
              const fileId = doc.fileId;
              const fileName = doc.fileName || "Document";
              const uploadDate = doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Recent";
              const chunks = doc.chunksCount || 1;

              return (
                <div
                  key={docId}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
                    isActive ? "bg-white border-purple-100 shadow-sm" : "bg-gray-50 border-gray-200 opacity-70"
                  }`}
                  data-testid={`kb-doc-${docId}`}
                >
                  <div className="flex items-center gap-3.5 min-w-[240px]">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      fileName.endsWith(".pdf") ? "bg-rose-100 text-rose-700" :
                      fileName.endsWith(".docx") ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {fileName.slice(fileName.lastIndexOf(".") + 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-purple-950 text-sm leading-snug line-clamp-1">{fileName}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-purple-900/60">
                        <span>Uploaded {uploadDate}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{chunks} Searchable Chunks</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-auto">
                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                    }`}>
                      <CheckCircle2 size={12} />
                      {isActive ? "Active in Chatbot" : "Disabled"}
                    </span>

                    {/* Enable / Disable Toggle */}
                    <button
                      onClick={() => handleToggleActive(docId, isActive)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                        isActive
                          ? "bg-purple-100 text-purple-900 hover:bg-purple-200"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                      data-testid={`kb-toggle-${docId}`}
                    >
                      {isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {isActive ? "Disable" : "Enable"}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(docId, fileId, fileName)}
                      className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete document"
                      data-testid={`kb-delete-${docId}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminKnowledgeBase;
