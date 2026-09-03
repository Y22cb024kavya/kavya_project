import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { api, setToken } from "../lib/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      navigate("/admin");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center px-6 relative overflow-hidden" data-testid="admin-login">
      <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-heading font-bold text-3xl tracking-[0.18em] bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light">VOKTAA</span>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 mt-3">Analytics Console</p>
        </div>
        <div className="card-gold bg-white p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center bg-gold/20 text-gold rounded-xl"><Lock size={18} /></div>
            <h1 className="font-heading font-bold text-xl text-navy">Admin Sign In</h1>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60 block mb-2">Email</label>
              <input type="email" className="input-brand w-full px-4 py-3" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="admin-email-input" />
            </div>
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60 block mb-2">Password</label>
              <input type="password" className="input-brand w-full px-4 py-3" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="admin-password-input" />
            </div>
            {error && <p className="text-destructive text-sm" data-testid="admin-login-error">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-gold text-navy-deep font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-gold-light transition-colors disabled:opacity-60" data-testid="admin-login-button">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
