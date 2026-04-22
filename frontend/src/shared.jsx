import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useLang } from "./context/LangContext";
import { useTheme } from "./context/ThemeContext";

import { C, G } from "./tokens.js";
// Re-exported so pages can still do: import { C, G } from "../shared"
export { C, G };


/* ── GreenBtn ────────────────────────────────────────────────── */
export function GreenBtn({ children, onClick, outline, style = {}, disabled }) {
  const [hov, setHov] = useState(false);

  const base = outline
    ? {
        background: "transparent",
        border: "2px solid var(--accent)",
        color: "var(--accent-dark, #006b5f)",
        boxShadow: hov ? "0 8px 24px var(--accent-glow)" : "none",
      }
    : {
        background: "var(--accent)",
        border: "none",
        color: "#fff",
        boxShadow: hov ? "0 28px 56px -10px var(--accent-glow)" : "0 20px 40px -10px var(--accent-glow)",
      };

  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...base,
        padding: "12px 28px", borderRadius: "1rem",
        fontSize: 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: G.sans, letterSpacing: ".3px",
        transition: "all .25s cubic-bezier(.4,0,.2,1)",
        transform: hov && !disabled ? "translateY(-2px)" : "translateY(0)",
        opacity: disabled ? .5 : 1,
        ...style,
      }}>
      {children}
    </button>
  );
}

/* ── Input ───────────────────────────────────────────────────── */
export function Input({ label, type = "text", placeholder, value, onChange, required, onClick, readOnly }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{ fontSize: 12, color: C.muted, fontFamily: G.label, letterSpacing: ".08em", fontWeight: 700, textTransform: "uppercase" }}>
          {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
        </label>
      )}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        readOnly={readOnly} onClick={onClick}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: "var(--input-bg)",
          border: focused ? "1.5px solid var(--accent)" : "1.5px solid var(--border-sub)",
          borderRadius: "1rem", padding: "12px 16px",
          color: "var(--text)", fontSize: 15, outline: "none",
          fontFamily: G.body, width: "100%",
          transition: "all .2s",
          boxShadow: focused ? "0 0 0 4px var(--accent-glow), inset 0 2px 6px rgba(0,0,0,0.06)" : "inset 0 2px 6px rgba(0,0,0,0.06)",
          cursor: readOnly ? "pointer" : "text",
        }}
      />
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────────────── */
export function Badge({ type }) {
  const veg = type === "Veg";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: veg ? "rgba(45,212,191,0.15)" : "rgba(251,146,60,0.15)",
      border: veg ? "1.5px solid var(--accent)" : "1.5px solid rgba(251,146,60,0.5)",
      borderRadius: 999, padding: "3px 12px", fontSize: 12,
      color: veg ? "var(--accent-dark, #006b5f)" : C.sDark, fontFamily: G.label, fontWeight: 700,
      letterSpacing: ".06em",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: veg ? "var(--accent)" : C.secondary, display: "inline-block" }} />
      {type}
    </span>
  );
}

/* ── SectionLabel ────────────────────────────────────────────── */
export function SectionLabel({ children }) {
  return (
    <div className="section-label-pill" style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      border: "1.5px solid var(--accent)",
      borderRadius: 999, padding: "5px 16px", marginBottom: "1rem",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
      <span style={{ fontSize: 11, color: "var(--accent-dark, #006b5f)", fontFamily: G.label, letterSpacing: ".12em", fontWeight: 700, textTransform: "uppercase" }}>
        {children}
      </span>
    </div>
  );
}

/* ── Glass Card ──────────────────────────────────────────────── */
export function Card3D({ children, style = {} }) {
  const [transform, setTransform] = useState("perspective(1200px) rotateX(0) rotateY(0)");

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    setTransform(`perspective(1200px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(6px)`);
  };
  const handleLeave = () => setTransform("perspective(1200px) rotateX(0) rotateY(0)");

  return (
    <div onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{
        transform, transition: "transform .12s ease",
        background: "var(--card-bg)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
        borderRadius: "1.5rem",
        boxShadow: "0 20px 40px -10px var(--accent-glow)",
        ...style,
      }}>
      {children}
    </div>
  );
}

/* ── Navbar ──────────────────────────────────────────────────── */
export function Navbar({ page, setPage, user, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLang();
  const links = [t("nav_home"), t("nav_about"), t("nav_contact")];
  const linkKeys = ["Home", "About", "Contact"];

  return (
    <nav style={{
      borderBottom: "1px solid rgba(45,212,191,0.15)",
      padding: "0 2rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 68, position: "sticky", top: 0, zIndex: 200,
      background: "var(--nav-bg)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      boxShadow: "0 1px 0 var(--accent-glow), 0 4px 24px rgba(0,0,0,0.06)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => setPage("Home")}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.primary}, ${C.pDark})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, boxShadow: "0 4px 12px rgba(45,212,191,0.4)",
        }}>🍱</div>
        <span style={{ fontWeight: 800, fontSize: 20, color: C.pDark, fontFamily: G.sans, letterSpacing: "-0.5px" }}>ResQMeal</span>
      </div>

      {/* Desktop nav */}
      <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }} className="desk-nav">
        {links.map((l, i) => {
          const key = linkKeys[i];
          return (
            <button key={key} onClick={() => setPage(key)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: page === key ? "var(--accent-dark, #006b5f)" : "var(--muted)",
                fontSize: 14, fontFamily: G.body, fontWeight: page === key ? 700 : 500,
                borderBottom: page === key ? "2px solid var(--accent)" : "2px solid transparent",
                paddingBottom: 2, transition: "color .2s",
              }}>
              {l}
            </button>
          );
        })}

        {user ? (
          <>
            <button onClick={() => setPage("DonateMeal")}
              style={{
                background: "rgba(251,146,60,0.1)", border: "1.5px solid rgba(251,146,60,0.4)",
                color: C.sDark, padding: "7px 18px", borderRadius: "1rem",
                fontSize: 14, cursor: "pointer", fontFamily: G.body, fontWeight: 600,
                transition: "all .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(251,146,60,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(251,146,60,0.1)"}>
              {t("nav_donate")}
            </button>
            <button onClick={() => setPage("Dashboard")}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(from var(--accent) r g b / 0.1)",
                border: "1.5px solid var(--accent)",
                color: "var(--accent-dark, #006b5f)", padding: "7px 16px", borderRadius: "1rem",
                fontSize: 14, cursor: "pointer", fontFamily: G.body, fontWeight: 600,
                transition: "all .2s",
              }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#fff",
              }}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              {user.name?.split(" ")[0]}
            </button>
            <button onClick={logout}
              style={{
                background: "transparent", border: "1.5px solid rgba(239,68,68,0.3)",
                color: "#dc2626", padding: "7px 16px", borderRadius: "1rem",
                fontSize: 14, cursor: "pointer", fontFamily: G.body, fontWeight: 600,
                transition: "all .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {t("nav_logout")}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setPage("Register")}
              style={{
                background: "transparent", border: "1.5px solid var(--accent)",
                color: "var(--accent-dark, #006b5f)", padding: "7px 18px", borderRadius: "1rem",
                fontSize: 14, cursor: "pointer", fontFamily: G.body, fontWeight: 600,
                transition: "all .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--accent-glow)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {t("nav_register")}
            </button>
            <button onClick={() => setPage("Login")}
              style={{
                background: "var(--accent)",
                color: "#fff", padding: "8px 22px", borderRadius: "1rem",
                fontSize: 14, cursor: "pointer", border: "none", fontFamily: G.body, fontWeight: 700,
                boxShadow: "0 4px 16px var(--accent-glow)", transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px var(--accent-glow)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px var(--accent-glow)"; }}>
              {t("nav_login")}
            </button>
          </>
        )}
      </div>

      {/* Hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="ham-btn"
        style={{
          display: "none", background: "none", border: "1.5px solid var(--accent)",
          borderRadius: "0.75rem", padding: "6px 10px", cursor: "pointer", color: "var(--accent-dark, #006b5f)", fontSize: 18,
        }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div style={{
          position: "absolute", top: 68, left: 0, right: 0,
          background: "var(--nav-bg)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--border-sub)",
          padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.2rem", zIndex: 300,
        }}>
          {[...linkKeys, ...(user ? ["Dashboard", "DonateMeal"] : ["Register", "Login"])].map(l => (
            <button key={l} onClick={() => { setMenuOpen(false); setPage(l); }}
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "var(--muted)", fontSize: 16, fontFamily: G.body, fontWeight: 500 }}>
              {l}
            </button>
          ))}
          {user && (
            <button onClick={() => { logout(); setMenuOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "#dc2626", fontSize: 16, fontFamily: G.body }}>
              {t("nav_logout")}
            </button>
          )}
        </div>
      )}

      <style>{`@media(max-width:700px){.desk-nav{display:none!important}.ham-btn{display:block!important}}`}</style>
    </nav>
  );
}

/* ── Footer ──────────────────────────────────────────────────── */
export function Footer({ setPage }) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  return (
    <footer style={{ background: "#f2f4ff", borderTop: "1px solid rgba(45,212,191,0.15)", marginTop: "4rem" }}>
      {/* Impact band */}
      <div style={{ background: `linear-gradient(135deg, rgba(45,212,191,0.12), rgba(251,146,60,0.08))`, padding: "3rem 2rem", textAlign: "center", borderBottom: "1px solid rgba(45,212,191,0.1)" }}>
        <p style={{ fontSize: 11, color: C.subtle, fontFamily: G.label, marginBottom: ".5rem", letterSpacing: ".12em", textTransform: "uppercase" }}>Impact So Far</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1.5rem,4vw,4rem)", flexWrap: "wrap" }}>
          {[["12,400+", "Meals rescued"], ["340+", "Partner PGs"], ["6,200+", "People fed"], ["18", "Cities soon"]].map(([n, l]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: C.pDark, margin: 0, fontFamily: G.sans }}>{n}</p>
              <p style={{ fontSize: 13, color: C.subtle, margin: 0, fontFamily: G.body }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "2.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: "1rem" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, ${C.pDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🍱</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: C.pDark, fontFamily: G.sans }}>ResQMeal</span>
          </div>
          <p style={{ fontSize: 13, color: C.subtle, fontFamily: G.body, lineHeight: 1.7, margin: 0 }}>Connecting surplus food from PGs &amp; hostels to people who need it.</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: C.dim, fontFamily: G.label, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "1rem" }}>Company</p>
          {[["About Us", "About"], ["How It Works", "Home"], ["Contact Us", "Contact"]].map(([t2, p]) => (
            <button key={t2} onClick={() => setPage(p)}
              style={{ display: "block", background: "none", border: "none", textAlign: "left", color: C.muted, fontSize: 14, fontFamily: G.body, cursor: "pointer", padding: "5px 0", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.pDark}
              onMouseLeave={e => e.currentTarget.style.color = C.muted}>
              {t2}
            </button>
          ))}
        </div>
        <div>
          <p style={{ fontSize: 11, color: C.dim, fontFamily: G.label, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "1rem" }}>For Users</p>
          {[["Find Food", "Home"], ["List Surplus", "DonateMeal"], ["Partner with Us", "Contact"]].map(([t2, p]) => (
            <button key={t2} onClick={() => setPage(p)}
              style={{ display: "block", background: "none", border: "none", textAlign: "left", color: C.muted, fontSize: 14, fontFamily: G.body, cursor: "pointer", padding: "5px 0", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.pDark}
              onMouseLeave={e => e.currentTarget.style.color = C.muted}>
              {t2}
            </button>
          ))}
        </div>
        <div>
          <p style={{ fontSize: 11, color: C.dim, fontFamily: G.label, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "1rem" }}>Newsletter</p>
          {subbed ? (
            <p style={{ color: C.pDark, fontSize: 13, fontFamily: G.body }}>✓ You&apos;re subscribed!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(0,0,0,0.1)", borderRadius: "0.75rem", padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: G.body, width: "100%", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)" }} />
              <button onClick={() => email && setSubbed(true)}
                style={{ background: `linear-gradient(135deg, ${C.primary}, #1fc8b5)`, color: "#fff", border: "none", borderRadius: "0.75rem", padding: "9px", fontSize: 13, cursor: "pointer", fontFamily: G.sans, fontWeight: 700, boxShadow: "0 4px 14px rgba(45,212,191,0.3)" }}>
                Subscribe →
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "1.2rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: 12, color: C.dim, fontFamily: G.body, margin: 0 }}>© 2025 ResQMeal. Made with 💚 to reduce food waste in India.</p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy", "Terms", "Cookies"].map(t2 => (
            <button key={t2} style={{ background: "none", border: "none", color: C.dim, fontSize: 12, fontFamily: G.body, cursor: "pointer" }}>{t2}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ── GlobalStyles ────────────────────────────────────────────── */
export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

      /* ── Light theme (default) ── */
      :root {
        --accent:          #2DD4BF;
        --accent-dark:     #006b5f;
        --accent-glow:     rgba(45,212,191,0.35);
        --secondary:       #FB923C;
        --bg:              #faf8ff;
        --surface:         rgba(255,255,255,0.65);
        --card-bg:         rgba(255,255,255,0.72);
        --glass-border:    rgba(255,255,255,0.5);
        --text:            #131b2e;
        --muted:           #3c4a46;
        --subtle:          #6b7a76;
        --dim:             #bacac5;
        --input-bg:        rgba(255,255,255,0.85);
        --nav-bg:          rgba(255,255,255,0.85);
        --border-sub:      rgba(0,0,0,0.07);
        --scrollbar-track: #f2f4ff;
      }
      /* ── Dark theme ── */
      [data-theme="dark"] {
        --bg:              #0d1117;
        --surface:         rgba(255,255,255,0.05);
        --card-bg:         rgba(255,255,255,0.06);
        --glass-border:    rgba(255,255,255,0.1);
        --text:            #e6edf3;
        --muted:           #8b949e;
        --subtle:          #656d76;
        --dim:             #30363d;
        --input-bg:        rgba(255,255,255,0.08);
        --nav-bg:          rgba(13,17,23,0.92);
        --border-sub:      rgba(255,255,255,0.08);
        --scrollbar-track: #161b22;
      }

      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

      body {
        background: var(--bg);
        color: var(--text);
        -webkit-font-smoothing: antialiased;
        font-family: 'Plus Jakarta Sans', sans-serif;
        transition: background .3s ease, color .3s ease;
      }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: var(--scrollbar-track); }
      ::-webkit-scrollbar-thumb { background: var(--accent-glow); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

      /* Accent-aware utility classes */
      .section-label-pill { background: color-mix(in srgb, var(--accent) 12%, transparent); }

      /* Smooth theme transition on all elements */
      *, *::before, *::after { transition: background-color .3s ease, border-color .3s ease, color .3s ease; }

      /* Animations */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes blob-float {
        0%,100% { transform: translate(0,0) scale(1); }
        33%      { transform: translate(40px,-60px) scale(1.08); }
        66%      { transform: translate(-30px,30px) scale(0.94); }
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes popIn {
        from { opacity:0; transform:translate(-50%,-50%) scale(.88); }
        to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
      }
      @keyframes slideUp {
        from { opacity:0; transform:translateY(10px); }
        to   { opacity:1; transform:translateY(0); }
      }

      ::selection { background: var(--accent); color: #fff; }

    `}</style>
  );
}

export default GlobalStyles;