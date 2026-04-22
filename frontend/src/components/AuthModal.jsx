import { useState } from "react";

import { C, G } from "../shared";
import { useLang } from "../context/LangContext";

export default function AuthModal({ onClose, onSuccess }) {
  const { t } = useLang();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", confirmPass: "" });
  const [resetEmail, setResetEmail] = useState("");

  const setL = f => e => setLoginForm(p => ({ ...p, [f]: e.target.value }));
  const setR = f => e => setRegForm(p => ({ ...p, [f]: e.target.value }));

  const inputStyle = {
    background: "rgba(255,255,255,0.9)",
    border: "1.5px solid rgba(0,0,0,0.1)",
    borderRadius: "1rem", padding: "12px 16px",
    color: C.text, fontSize: 15, outline: "none",
    fontFamily: G.body, width: "100%",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)",
    transition: "border-color .2s, box-shadow .2s",
  };
  const focus = e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(45,212,191,0.15), inset 0 2px 6px rgba(0,0,0,0.05)"; };
  const blur  = e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.05)"; };

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginForm) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed."); return; }
      const { useAuth } = await import("../context/AuthContext");
      // Call login through a workaround — use localStorage directly
      localStorage.setItem("rqm_token", data.token);
      localStorage.setItem("rqm_user", JSON.stringify(data.user));
      onSuccess?.();
      onClose();
      window.location.reload();
    } catch { setError("Could not reach server."); } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!regForm.name || !regForm.email || !regForm.password) { setError("Please fill in all fields."); return; }
    if (regForm.password !== regForm.confirmPass) { setError("Passwords do not match."); return; }
    setError(""); setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: regForm.name, email: regForm.email, password: regForm.password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Registration failed."); return; }
      localStorage.setItem("rqm_token", data.token);
      localStorage.setItem("rqm_user", JSON.stringify(data.user));
      onSuccess?.();
      onClose();
      window.location.reload();
    } catch { setError("Could not reach server."); } finally { setLoading(false); }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(19,27,46,0.5)", backdropFilter: "blur(8px)", zIndex: 3000 }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", zIndex: 3001,
        width: "min(92vw, 440px)",
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderRadius: "1.5rem", padding: "2rem",
        boxShadow: "0 30px 80px rgba(45,212,191,0.2), 0 0 0 1px rgba(45,212,191,0.1)",
        animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 30, height: 30, color: C.muted, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, ${C.pDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 14px rgba(45,212,191,0.35)" }}>🍱</div>
          <span style={{ fontFamily: G.sans, fontSize: 20, fontWeight: 800, color: C.pDark }}>ResQMeal</span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(0,0,0,0.04)", borderRadius: "0.75rem", padding: 4, marginBottom: "1.5rem" }}>
          {[["login","Sign In"],["register","Register"],["forgot","Forgot"]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setError(""); }}
              style={{
                flex: 1, padding: "8px", borderRadius: "0.625rem", border: "none",
                background: tab === key ? "#fff" : "transparent",
                color: tab === key ? C.pDark : C.subtle,
                fontSize: 13, fontWeight: tab === key ? 700 : 500,
                cursor: "pointer", fontFamily: G.body,
                boxShadow: tab === key ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                transition: "all .2s",
              }}>
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.25)", borderRadius: "0.75rem", padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ color: "#dc2626", fontSize: 13, fontFamily: G.body, margin: 0 }}>⚠ {error}</p>
          </div>
        )}

        {tab === "login" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input placeholder="Email" type="email" value={loginForm.email} onChange={setL("email")} style={inputStyle} onFocus={focus} onBlur={blur} />
            <div style={{ position: "relative" }}>
              <input placeholder="Password" type={showPass ? "text" : "password"} value={loginForm.password} onChange={setL("password")} style={{ ...inputStyle, paddingRight: 44 }} onFocus={focus} onBlur={blur} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.subtle, fontSize: 16 }}>{showPass ? "🙈" : "👁"}</button>
            </div>
            <button onClick={handleLogin} disabled={loading}
              style={{ padding: "13px", borderRadius: "1rem", border: "none", background: `linear-gradient(135deg, ${C.primary}, #1fc8b5)`, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: G.sans, boxShadow: "0 4px 20px rgba(45,212,191,0.35)", transition: "all .2s", opacity: loading ? .7 : 1 }}>
              {loading ? "Signing in…" : t("login_btn")}
            </button>
            <p style={{ textAlign: "center", fontSize: 13, color: C.subtle, fontFamily: G.body, margin: 0 }}>
              Don't have an account?{" "}
              <button onClick={() => setTab("register")} style={{ background: "none", border: "none", color: C.pDark, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Register →</button>
            </p>
          </div>
        )}

        {tab === "register" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input placeholder="Full Name" value={regForm.name} onChange={setR("name")} style={inputStyle} onFocus={focus} onBlur={blur} />
            <input placeholder="Email" type="email" value={regForm.email} onChange={setR("email")} style={inputStyle} onFocus={focus} onBlur={blur} />
            <input placeholder="Password" type="password" value={regForm.password} onChange={setR("password")} style={inputStyle} onFocus={focus} onBlur={blur} />
            <input placeholder="Confirm Password" type="password" value={regForm.confirmPass} onChange={setR("confirmPass")} style={inputStyle} onFocus={focus} onBlur={blur} />
            <button onClick={handleRegister} disabled={loading}
              style={{ padding: "13px", borderRadius: "1rem", border: "none", background: `linear-gradient(135deg, ${C.primary}, #1fc8b5)`, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: G.sans, boxShadow: "0 4px 20px rgba(45,212,191,0.35)", opacity: loading ? .7 : 1 }}>
              {loading ? "Creating…" : "Create Account 🎉"}
            </button>
          </div>
        )}

        {tab === "forgot" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {resetSent ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <span style={{ fontSize: 48, display: "block", marginBottom: "1rem" }}>📧</span>
                <p style={{ color: C.pDark, fontSize: 16, fontWeight: 700, fontFamily: G.sans }}>Check your email!</p>
                <p style={{ color: C.subtle, fontSize: 13, fontFamily: G.body, marginTop: 8 }}>Reset link sent to <strong>{resetEmail}</strong></p>
              </div>
            ) : (
              <>
                <p style={{ color: C.subtle, fontSize: 13, fontFamily: G.body, lineHeight: 1.6, margin: 0 }}>Enter your email and we'll send a reset link.</p>
                <input placeholder="your@email.com" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
                <button onClick={() => resetEmail.includes("@") && setResetSent(true)}
                  style={{ padding: "13px", borderRadius: "1rem", border: "none", background: `linear-gradient(135deg, ${C.primary}, #1fc8b5)`, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: G.sans, boxShadow: "0 4px 20px rgba(45,212,191,0.35)" }}>
                  Send Reset Link →
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
