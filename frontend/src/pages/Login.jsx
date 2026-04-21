import { useState } from "react";
import { G, GreenBtn, Input, SectionLabel } from "../shared";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";

export default function Login({ setPage }) {
  const { login } = useAuth();
  const { t } = useLang();
  const { accent } = useTheme();

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
    setError(""); setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed."); setLoading(false); return; }
      login(data.token, data.user);
      setPage("Home"); // ← go back to Home after login
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

  const cardStyle = {
    background: "rgba(13,26,13,0.7)",
    backdropFilter: "blur(24px)",
    border: `1px solid ${accent.value}30`,
    borderRadius: 24, padding: "2rem",
    boxShadow: `0 0 60px ${accent.glow}20, 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)`,
  };

  return (
    <div style={{
      minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem",
    }}>
      {/* Background orb */}
      <div style={{
        position: "fixed", top: "20%", right: "10%",
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${accent.value}12 0%, transparent 70%)`,
        animation: "orb-float 20s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, margin: "0 auto 1rem",
            boxShadow: `0 0 30px ${accent.glow}`,
            animation: "pulse-glow 3s ease-in-out infinite",
          }}>🏠</div>

          {tab === "login" ? (
            <>
              <SectionLabel>{t("login_welcome")}</SectionLabel>
              <h1 style={{
                fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 800, color: "#e8f5e8",
                margin: ".5rem 0 .6rem", letterSpacing: "-1px", fontFamily: G.sans,
              }}>
                {t("login_title")}{" "}
                <span style={{
                  background: `linear-gradient(135deg, ${accent.value}, ${accent.dark})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>ResQMeal</span>
              </h1>
              <p style={{ color: "#5a7a5a", fontSize: 14, fontFamily: G.body, margin: 0 }}>
                {t("login_sub")}{" "}
                <button onClick={() => setPage("Register")}
                  style={{ background: "none", border: "none", color: accent.value, cursor: "pointer", fontSize: 14, fontFamily: G.body }}>
                  {t("login_create")}
                </button>
              </p>
            </>
          ) : (
            <>
              <SectionLabel>ACCOUNT RECOVERY</SectionLabel>
              <h1 style={{
                fontSize: "clamp(2rem,4vw,2.6rem)", fontWeight: 800, color: "#e8f5e8",
                margin: ".5rem 0 .6rem", letterSpacing: "-1px", fontFamily: G.sans,
              }}>
                Reset your{" "}
                <span style={{
                  background: `linear-gradient(135deg, ${accent.value}, ${accent.dark})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>password</span>
              </h1>
              <p style={{ color: "#5a7a5a", fontSize: 14, fontFamily: G.body, margin: 0 }}>
                Remember it?{" "}
                <button onClick={() => { setTab("login"); setResetSent(false); }}
                  style={{ background: "none", border: "none", color: accent.value, cursor: "pointer", fontSize: 14, fontFamily: G.body }}>
                  Back to sign in →
                </button>
              </p>
            </>
          )}
        </div>

        {/* Card */}
        <div style={cardStyle}>

          {/* ── LOGIN FORM ─────────────────────────────── */}
          {tab === "login" && (
            <>
              {/* Social login */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.75rem" }}>
                {[["🔵", "Google"], ["⚫", "GitHub"]].map(([ico, name]) => (
                  <button key={name}
                    style={{
                      padding: "11px", borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.04)", color: "#e8f5e8",
                      fontSize: 14, cursor: "pointer",
                      fontFamily: G.body, display: "flex", alignItems: "center",
                      justifyContent: "center", gap: 8, transition: "all .2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = accent.value; e.currentTarget.style.background = `${accent.value}10`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                    <span>{ico}</span> {name}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.75rem" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                <span style={{ fontSize: 12, color: "#3a5a3a", fontFamily: G.body }}>or continue with email</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  background: "rgba(42,10,10,0.8)", border: "1px solid rgba(90,26,26,0.6)",
                  borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                }}>
                  <p style={{ color: "#f87171", fontSize: 13, fontFamily: G.body, margin: 0 }}>⚠ {error}</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Input label={t("login_email")} type="email" placeholder="you@email.com"
                  value={form.email} onChange={set("email")} required />

                {/* Password with toggle */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: 12, color: "#7a9a7a", fontFamily: G.body, letterSpacing: ".5px" }}>
                      {t("login_pass")} <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <button onClick={() => setTab("forgot")}
                      style={{ background: "none", border: "none", color: accent.value, fontSize: 12, cursor: "pointer", fontFamily: G.body }}>
                      {t("login_forgot")}
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input type={showPass ? "text" : "password"} placeholder="Enter password"
                      value={form.password} onChange={set("password")}
                      onFocus={e => { e.currentTarget.style.borderColor = accent.value; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent.glow}`; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 12, padding: "12px 44px 12px 16px",
                        color: "#e8f5e8", fontSize: 14, outline: "none",
                        fontFamily: G.body, width: "100%", transition: "all .2s",
                      }} />
                    <button onClick={() => setShowPass(!showPass)}
                      style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer",
                        color: "#5a7a5a", fontSize: 16, padding: 0,
                      }}>
                      {showPass ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => setRememberMe(!rememberMe)}
                    style={{
                      width: 20, height: 20, borderRadius: 5,
                      border: `1px solid ${rememberMe ? accent.value : "rgba(255,255,255,0.15)"}`,
                      background: rememberMe ? `${accent.value}30` : "transparent",
                      cursor: "pointer", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 11, color: accent.value,
                      transition: "all .2s",
                    }}>
                    {rememberMe ? "✓" : ""}
                  </button>
                  <span style={{ fontSize: 13, color: "#5a7a5a", fontFamily: G.body }}>{t("login_remember")}</span>
                </div>

                <GreenBtn onClick={handleLogin} disabled={loading} style={{ width: "100%", borderRadius: 12, padding: "13px" }}>
                  {loading ? "Signing in…" : t("login_btn")}
                </GreenBtn>
              </div>
            </>
          )}

          {/* ── FORGOT PASSWORD ─────────────────────────── */}
          {tab === "forgot" && (
            <>
              {resetSent ? (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <span style={{ fontSize: 52, display: "block", marginBottom: "1rem" }}>📧</span>
                  <p style={{ color: accent.value, fontSize: 17, fontWeight: 700, fontFamily: G.sans }}>Check your email!</p>
                  <p style={{ color: "#5a7a5a", fontSize: 14, fontFamily: G.body, marginTop: 8, lineHeight: 1.6 }}>
                    We've sent a reset link to<br />
                    <strong style={{ color: "#e8f5e8" }}>{resetEmail}</strong>
                  </p>
                  <p style={{ color: "#3a5a3a", fontSize: 12, fontFamily: G.body, marginTop: "1rem" }}>
                    Didn't receive it? Check spam or{" "}
                    <button onClick={() => setResetSent(false)}
                      style={{ background: "none", border: "none", color: accent.value, cursor: "pointer", fontSize: 12, fontFamily: G.body }}>
                      try again
                    </button>
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <p style={{ color: "#5a7a5a", fontSize: 14, fontFamily: G.body, lineHeight: 1.6, margin: 0 }}>
                    Enter the email linked to your ResQMeal account and we'll send a reset link.
                  </p>
                  <Input label="Email Address" type="email" placeholder="you@email.com"
                    value={resetEmail} onChange={e => setResetEmail(e.target.value)} required />
                  <GreenBtn onClick={handleReset} style={{ width: "100%", borderRadius: 12, padding: "13px" }}>
                    Send Reset Link →
                  </GreenBtn>
                </div>
              )}
            </>
          )}
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
          {["🔒 Secure login", "🌱 Free to use", "💚 No spam"].map(tx => (
            <span key={tx} style={{ fontSize: 12, color: "#3a5a3a", fontFamily: G.body }}>{tx}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
