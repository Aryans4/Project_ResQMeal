import { useState } from "react";
import { C, G, GreenBtn, SectionLabel } from "../shared";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

export default function Login({ setPage }) {
  const { login } = useAuth();
  const { t } = useLang();
  const [form, setForm] = useState({ email:"", password:"" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const inputStyle = {
    background:"rgba(255,255,255,0.9)", border:"1.5px solid rgba(0,0,0,0.1)",
    borderRadius:"1rem", padding:"13px 16px", color:C.text, fontSize:15,
    outline:"none", fontFamily:G.body, width:"100%",
    boxShadow:"inset 0 2px 6px rgba(0,0,0,0.05)", transition:"border-color .2s, box-shadow .2s",
  };
  const iFocus = e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(45,212,191,0.15), inset 0 2px 6px rgba(0,0,0,0.05)"; };
  const iBlur  = e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.05)"; };

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    try {
      await login(form.email, form.password);
      setPage("Home");
    } catch (e) { setError(e.message || "Invalid credentials."); } finally { setLoading(false); }
  };

  const handleKey = e => { if (e.key === "Enter") handleLogin(); };

  return (
    <div style={{ background:"#faf8ff", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", position:"relative" }}>
      {/* Background blobs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(45,212,191,0.14) 0%, transparent 70%)", top:"-20%", left:"-15%", filter:"blur(40px)", animation:"blob-float 18s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)", bottom:"-10%", right:"-15%", filter:"blur(40px)", animation:"blob-float 22s ease-in-out 4s infinite" }} />
      </div>

      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:440 }}>
        {/* Glass card */}
        <div style={{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.6)", borderRadius:"1.5rem", padding:"2.5rem", boxShadow:"0 30px 80px rgba(45,212,191,0.15), 0 0 0 1px rgba(45,212,191,0.08)", animation:"fadeUp .5s ease" }}>

          {/* Brand */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"2rem" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg, ${C.primary}, ${C.pDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 4px 16px rgba(45,212,191,0.4)" }}>🍱</div>
            <span style={{ fontFamily:G.sans, fontSize:22, fontWeight:800, color:C.pDark }}>ResQMeal</span>
          </div>

          <SectionLabel>{t("login_welcome")}</SectionLabel>
          <h1 style={{ fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:800, color:C.text, letterSpacing:"-0.03em", fontFamily:G.sans, margin:"0 0 .4rem", lineHeight:1.2 }}>
            {t("login_title")} <span style={{ background:"linear-gradient(135deg, var(--accent), var(--accent-dark, #006b5f))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ResQMeal</span>
          </h1>
          <p style={{ color:C.muted, fontSize:14, fontFamily:G.body, margin:"0 0 2rem" }}>
            {t("login_sub")} <button onClick={() => setPage("Register")} style={{ background:"none", border:"none", color:C.pDark, cursor:"pointer", fontSize:14, fontWeight:700, fontFamily:G.body }}>{t("login_create")}</button>
          </p>

          <form onSubmit={e => { e.preventDefault(); handleLogin(); }} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:12, color:C.muted, fontFamily:G.label, letterSpacing:".08em", fontWeight:700, textTransform:"uppercase" }}>{t("login_email")}</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} style={inputStyle} onFocus={iFocus} onBlur={iBlur} />
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <label style={{ fontSize:12, color:C.muted, fontFamily:G.label, letterSpacing:".08em", fontWeight:700, textTransform:"uppercase" }}>{t("login_pass")}</label>
                <button type="button" style={{ background:"none", border:"none", color:"var(--accent)", cursor:"pointer", fontSize:12, fontFamily:G.body, fontWeight:600 }}>{t("login_forgot")}</button>
              </div>
              <div style={{ position:"relative" }}>
                <input type={showPass ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" value={form.password} onChange={set("password")} style={{ ...inputStyle, paddingRight:44 }} onFocus={iFocus} onBlur={iBlur} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:C.subtle, fontSize:16 }}>{showPass ? "🙈" : "👁"}</button>
              </div>
            </div>

            {error && (
              <div style={{ background:"rgba(239,68,68,0.08)", border:"1.5px solid rgba(239,68,68,0.2)", borderRadius:"0.875rem", padding:"10px 14px" }}>
                <p style={{ color:"#dc2626", fontSize:13, fontFamily:G.body, margin:0 }}>⚠ {error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ padding:"14px", borderRadius:"1rem", border:"none", background:"var(--accent)", color:"#fff", fontSize:15, fontWeight:700, cursor:loading ? "not-allowed" : "pointer", fontFamily:G.sans, boxShadow:"0 4px 24px var(--accent-glow)", transition:"all .2s", opacity:loading ? .7 : 1, letterSpacing:".3px" }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 32px var(--accent-glow)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 24px var(--accent-glow)"; }}>
              {loading ? "Signing in…" : t("login_btn")}
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <p style={{ textAlign:"center", marginTop:"1.5rem", color:C.muted, fontSize:14, fontFamily:G.body }}>
          New to ResQMeal?{" "}
          <button onClick={() => setPage("Register")} style={{ background:"none", border:"none", color:C.pDark, fontWeight:700, cursor:"pointer", fontFamily:G.body, fontSize:14 }}>Create free account →</button>
        </p>
      </div>
    </div>
  );
}
