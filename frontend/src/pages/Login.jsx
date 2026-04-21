import { useState } from "react";
import { C, G, GreenBtn, Input, SectionLabel } from "../shared";
import { useAuth } from "../context/AuthContext";

export default function Login({ setPage }) {
  const { login } = useAuth();
  const [tab,        setTab]        = useState("login");
  const [form,       setForm]       = useState({ email: "", password: "" });
  const [resetEmail, setResetEmail] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [resetSent,  setResetSent]  = useState(false);
  const [showPass,   setShowPass]   = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error,      setError]      = useState("");

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (!form.email.includes("@"))     { setError("Enter a valid email address."); return; }
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed."); setLoading(false); return; }
      login(data.token, data.user);
      setPage("Dashboard");
    } catch {
      setError("Could not reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!resetEmail.includes("@")) return;
    setResetSent(true);
  };

  return (
    <div style={{ maxWidth: 460, margin: "4rem auto", padding: "0 2rem 5rem" }}>

      {/* ── Header ───────────────────────────────────────── */}
      {tab === "login" ? (
        <>
          <SectionLabel>WELCOME BACK</SectionLabel>
          <h1 style={{
            fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 800, color: C.text,
            margin: "0 0 .6rem", letterSpacing: "-1px", fontFamily: G.sans,
          }}>
            Sign in to <span style={{ color: C.green }}>ResQMeal</span>
          </h1>
          <p style={{ color: C.subtle, fontSize: 15, fontFamily: G.body, margin: "0 0 2.5rem" }}>
            New here?{" "}
            <button onClick={() => setPage("Register")}
              style={{ background: "none", border: "none", color: C.green, cursor: "pointer", fontSize: 15, fontFamily: G.body }}>
              Create an account →
            </button>
          </p>
        </>
      ) : (
        <>
          <SectionLabel>ACCOUNT RECOVERY</SectionLabel>
          <h1 style={{
            fontSize: "clamp(2rem,4vw,2.6rem)", fontWeight: 800, color: C.text,
            margin: "0 0 .6rem", letterSpacing: "-1px", fontFamily: G.sans,
          }}>
            Reset your <span style={{ color: C.green }}>password</span>
          </h1>
          <p style={{ color: C.subtle, fontSize: 15, fontFamily: G.body, margin: "0 0 2.5rem" }}>
            Remember it?{" "}
            <button onClick={() => { setTab("login"); setResetSent(false); }}
              style={{ background: "none", border: "none", color: C.green, cursor: "pointer", fontSize: 15, fontFamily: G.body }}>
              Back to sign in →
            </button>
          </p>
        </>
      )}

      {/* ── Card ─────────────────────────────────────────── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "2rem" }}>

        {/* ── LOGIN FORM ───────────────────────────────── */}
        {tab === "login" && (
          <>
            {/* Social login */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.75rem" }}>
              {[["🔵", "Google"], ["⚫", "GitHub"]].map(([ico, name]) => (
                <button key={name}
                  style={{
                    padding: "11px", borderRadius: 10, border: `1px solid ${C.border}`,
                    background: "#0f1f0f", color: C.text, fontSize: 14, cursor: "pointer",
                    fontFamily: G.body, display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8, transition: "border-color .2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHov}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <span>{ico}</span> {name}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.75rem" }}>
              <div style={{ flex: 1, height: 1, background: C.border }} />
              <span style={{ fontSize: 12, color: C.dim, fontFamily: G.body }}>or continue with email</span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "#2a0a0a", border: "1px solid #4a1a1a", borderRadius: 10,
                padding: "10px 14px", marginBottom: 16,
              }}>
                <p style={{ color: "#f87171", fontSize: 13, fontFamily: G.body, margin: 0 }}>⚠ {error}</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Input label="Email Address" type="email" placeholder="you@email.com"
                value={form.email} onChange={set("email")} required />

              {/* Password field with toggle */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>
                    Password <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <button onClick={() => setTab("forgot")}
                    style={{ background: "none", border: "none", color: C.green, fontSize: 12, cursor: "pointer", fontFamily: G.body }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input type={showPass ? "text" : "password"} placeholder="Enter password"
                    value={form.password} onChange={set("password")}
                    style={{
                      background: "#0f1f0f", border: `1px solid ${C.border}`, borderRadius: 10,
                      padding: "11px 44px 11px 14px", color: C.text, fontSize: 14, outline: "none",
                      fontFamily: G.body, width: "100%",
                    }} />
                  <button onClick={() => setShowPass(!showPass)}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: C.muted, fontSize: 16, padding: 0,
                    }}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setRememberMe(!rememberMe)}
                  style={{
                    width: 20, height: 20, borderRadius: 5, border: `1px solid ${rememberMe ? C.green : C.border}`,
                    background: rememberMe ? C.greenDark : "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: "#fff",
                  }}>
                  {rememberMe ? "✓" : ""}
                </button>
                <span style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>Remember me for 30 days</span>
              </div>

              <button onClick={handleLogin} disabled={loading}
                style={{
                  width: "100%", padding: 12, borderRadius: 10, border: "none",
                  background: loading ? "#0f2a0f" : C.greenDark, color: loading ? C.green : "#fff",
                  fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: G.sans, transition: "background .2s", marginTop: 4,
                }}>
                {loading ? "Signing in…" : "Sign In →"}
              </button>
            </div>
          </>
        )}

        {/* ── FORGOT PASSWORD FORM ─────────────────────── */}
        {tab === "forgot" && (
          <>
            {resetSent ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <span style={{ fontSize: 52, display: "block", marginBottom: "1rem" }}>📧</span>
                <p style={{ color: C.green, fontSize: 17, fontWeight: 700, fontFamily: G.sans }}>Check your email!</p>
                <p style={{ color: C.subtle, fontSize: 14, fontFamily: G.body, marginTop: 8, lineHeight: 1.6 }}>
                  We've sent a password reset link to<br />
                  <strong style={{ color: C.text }}>{resetEmail}</strong>
                </p>
                <p style={{ color: C.dim, fontSize: 12, fontFamily: G.body, marginTop: "1rem" }}>
                  Didn't receive it? Check spam or{" "}
                  <button onClick={() => setResetSent(false)}
                    style={{ background: "none", border: "none", color: C.green, cursor: "pointer", fontSize: 12, fontFamily: G.body }}>
                    try again
                  </button>
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ color: C.subtle, fontSize: 14, fontFamily: G.body, lineHeight: 1.6, margin: 0 }}>
                  Enter the email address linked to your ResQMeal account and we'll send you a reset link.
                </p>
                <Input label="Email Address" type="email" placeholder="you@email.com"
                  value={resetEmail} onChange={e => setResetEmail(e.target.value)} required />
                <GreenBtn onClick={handleReset}>Send Reset Link →</GreenBtn>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Trust badges ─────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
        {["🔒 Secure login", "🌱 Free to use", "💚 No spam"].map(t => (
          <span key={t} style={{ fontSize: 12, color: C.dim, fontFamily: G.body }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
