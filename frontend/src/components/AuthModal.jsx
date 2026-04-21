import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";

export default function AuthModal({ onClose, onSuccess }) {
  const { login } = useAuth();
  const { t } = useLang();
  const { accent } = useTheme();

  const [tab,       setTab]       = useState("login");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm,   setRegForm]   = useState({ name: "", email: "", password: "", confirmPass: "" });
  const [resetEmail, setResetEmail] = useState("");

  const setL = f => e => setLoginForm(p => ({ ...p, [f]: e.target.value }));
  const setR = f => e => setRegForm(p => ({ ...p, [f]: e.target.value }));

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "11px 14px",
    color: "#e8f5e8", fontSize: 14, outline: "none",
    fontFamily: "'Inter', sans-serif", width: "100%",
    transition: "border-color .2s",
  };

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed."); return; }
      login(data.token, data.user);
      onSuccess?.();
      onClose();
    } catch {
      setError("Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regForm.name || !regForm.email || !regForm.password) { setError("Please fill in all fields."); return; }
    if (regForm.password !== regForm.confirmPass) { setError("Passwords do not match."); return; }
    setError(""); setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regForm.name, email: regForm.email, password: regForm.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Registration failed."); return; }
      login(data.token, data.user);
      onSuccess?.();
      onClose();
    } catch {
      setError("Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.80)",
          backdropFilter: "blur(8px)",
          zIndex: 3000,
        }}
      />

      {/* Modal card */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 3001,
        width: "min(92vw, 440px)",
        background: "linear-gradient(135deg, #0d1a10 0%, #080c08 100%)",
        border: `1px solid ${accent.value}40`,
        borderRadius: 24,
        padding: "2rem",
        boxShadow: `0 0 80px ${accent.glow}, 0 40px 100px rgba(0,0,0,0.9)`,
        animation: "modalIn .35s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <style>{`
          @keyframes modalIn {
            from { opacity:0; transform:translate(-50%,-50%) scale(.88); }
            to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
          }
        `}</style>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.07)", border: "none",
            borderRadius: "50%", width: 32, height: 32,
            color: "#7a9a7a", cursor: "pointer", fontSize: 15,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, boxShadow: `0 0 16px ${accent.glow}`,
          }}>🏠</div>
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 20, fontWeight: 800,
            color: accent.value,
          }}>ResQMeal</span>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "rgba(255,255,255,0.05)",
          borderRadius: 10, padding: 4, marginBottom: "1.5rem",
        }}>
          {[["login", "Sign In"], ["register", "Register"], ["forgot", "Forgot"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setError(""); }}
              style={{
                flex: 1, padding: "8px", borderRadius: 8, border: "none",
                background: tab === key ? `${accent.value}20` : "transparent",
                color: tab === key ? accent.value : "#5a7a5a",
                fontSize: 13, fontWeight: tab === key ? 600 : 400,
                cursor: "pointer", fontFamily: "'Inter', sans-serif",
                transition: "all .2s",
                boxShadow: tab === key ? `0 0 10px ${accent.glow}` : "none",
              }}
            >{label}</button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#2a0a0a", border: "1px solid #5a1a1a",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
          }}>
            <p style={{ color: "#f87171", fontSize: 13, fontFamily: "'Inter', sans-serif", margin: 0 }}>
              ⚠ {error}
            </p>
          </div>
        )}

        {/* ── LOGIN ── */}
        {tab === "login" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input placeholder="Email" type="email" value={loginForm.email}
              onChange={setL("email")} style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = accent.value}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            <div style={{ position: "relative" }}>
              <input placeholder="Password" type={showPass ? "text" : "password"}
                value={loginForm.password} onChange={setL("password")}
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => e.currentTarget.style.borderColor = accent.value}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button onClick={() => setShowPass(!showPass)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#5a7a5a", fontSize: 15,
              }}>{showPass ? "🙈" : "👁"}</button>
            </div>
            <button
              onClick={handleLogin} disabled={loading}
              style={{
                padding: "13px", borderRadius: 12, border: "none",
                background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
                color: "#fff", fontSize: 14, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Orbitron', sans-serif",
                boxShadow: `0 4px 20px ${accent.glow}`,
                transition: "transform .2s, box-shadow .2s",
                opacity: loading ? .7 : 1,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${accent.glow}`; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${accent.glow}`; }}
            >{loading ? "Signing in…" : t("login_btn")}</button>
            <p style={{ textAlign: "center", fontSize: 13, color: "#5a7a5a", fontFamily: "'Inter', sans-serif", margin: 0 }}>
              Don't have an account?{" "}
              <button onClick={() => setTab("register")}
                style={{ background: "none", border: "none", color: accent.value, cursor: "pointer", fontSize: 13 }}>
                Register →
              </button>
            </p>
          </div>
        )}

        {/* ── REGISTER ── */}
        {tab === "register" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input placeholder="Full Name" value={regForm.name} onChange={setR("name")}
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = accent.value}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            <input placeholder="Email" type="email" value={regForm.email} onChange={setR("email")}
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = accent.value}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            <input placeholder="Password (min 8 chars)" type="password" value={regForm.password}
              onChange={setR("password")} style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = accent.value}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            <input placeholder="Confirm Password" type="password" value={regForm.confirmPass}
              onChange={setR("confirmPass")} style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = accent.value}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            {regForm.password && regForm.confirmPass && regForm.password !== regForm.confirmPass && (
              <p style={{ color: "#ef4444", fontSize: 12, fontFamily: "'Inter', sans-serif", margin: 0 }}>
                Passwords do not match
              </p>
            )}
            <button
              onClick={handleRegister} disabled={loading}
              style={{
                padding: "13px", borderRadius: 12, border: "none",
                background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
                color: "#fff", fontSize: 14, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Orbitron', sans-serif",
                boxShadow: `0 4px 20px ${accent.glow}`,
                transition: "transform .2s, box-shadow .2s",
                opacity: loading ? .7 : 1,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${accent.glow}`; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${accent.glow}`; }}
            >{loading ? "Creating account…" : "Create Account 🎉"}</button>
            <p style={{ textAlign: "center", fontSize: 12, color: "#3a5a3a", fontFamily: "'Inter', sans-serif", margin: 0, lineHeight: 1.6 }}>
              For full registration (PG details, city, state), use the full <button onClick={() => { onClose(); }} style={{ background: "none", border: "none", color: accent.value, cursor: "pointer", fontSize: 12, fontFamily: "'Inter', sans-serif" }}>Register page</button>
            </p>
          </div>
        )}

        {/* ── FORGOT ── */}
        {tab === "forgot" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {resetSent ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <span style={{ fontSize: 48, display: "block", marginBottom: "1rem" }}>📧</span>
                <p style={{ color: accent.value, fontSize: 16, fontWeight: 700, fontFamily: "'Orbitron', sans-serif" }}>Check your email!</p>
                <p style={{ color: "#5a7a5a", fontSize: 13, fontFamily: "'Inter', sans-serif", marginTop: 8 }}>
                  Reset link sent to <strong style={{ color: "#9ab39a" }}>{resetEmail}</strong>
                </p>
              </div>
            ) : (
              <>
                <p style={{ color: "#5a7a5a", fontSize: 13, fontFamily: "'Inter', sans-serif", lineHeight: 1.6, margin: 0 }}>
                  Enter your email and we'll send a reset link.
                </p>
                <input placeholder="your@email.com" type="email" value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)} style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = accent.value}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button
                  onClick={() => resetEmail.includes("@") && setResetSent(true)}
                  style={{
                    padding: "13px", borderRadius: 12, border: "none",
                    background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
                    color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Orbitron', sans-serif",
                    boxShadow: `0 4px 20px ${accent.glow}`,
                  }}
                >Send Reset Link →</button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
