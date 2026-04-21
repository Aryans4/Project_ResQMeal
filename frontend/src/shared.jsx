import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useLang } from "./context/LangContext";
import { useTheme } from "./context/ThemeContext";

/* ── Design Tokens ────────────────────────────────────────────── */
export const G = { sans: "'Orbitron', sans-serif", body: "'Inter', sans-serif" };
export const C = {
  bg:        "#060a06",
  card:      "rgba(13,26,13,0.8)",
  cardSolid: "#0d1a0d",
  border:    "rgba(255,255,255,0.08)",
  borderHov: "var(--accent, #10b981)",
  green:     "var(--accent, #10b981)",
  greenDark: "var(--accent-dark, #059669)",
  greenDeep: "var(--accent-dark, #059669)",
  text:      "#e8f5e8",
  muted:     "#7a9a7a",
  dim:       "#3a5a3a",
  subtle:    "#5a7a5a",
};
export const uc = u => u > 65 ? "#ef4444" : u > 40 ? "#f59e0b" : "var(--accent, #10b981)";

/* ── GreenBtn ────────────────────────────────────────────────── */
export function GreenBtn({ children, onClick, outline, style = {}, disabled }) {
  const [hov, setHov] = useState(false);
  const { accent } = useTheme();

  const base = outline
    ? {
        background: "transparent",
        border: `1px solid ${accent.value}`,
        color: accent.value,
      }
    : {
        background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
        color: "#fff",
        border: "none",
        boxShadow: hov ? `0 8px 30px ${accent.glow}, 0 0 0 1px ${accent.value}30` : `0 4px 20px ${accent.glow}`,
      };

  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...base,
        padding: "12px 28px", borderRadius: 50,
        fontSize: 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: G.sans, letterSpacing: ".5px",
        transition: "all .25s cubic-bezier(.4,0,.2,1)",
        transform: hov && !disabled ? "translateY(-2px) scale(1.02)" : "translateY(0) scale(1)",
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
  const { accent } = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{ fontSize: 12, color: C.muted, fontFamily: G.body, letterSpacing: ".5px" }}>
          {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
        </label>
      )}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        readOnly={readOnly} onClick={onClick}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? accent.value : "rgba(255,255,255,0.08)"}`,
          borderRadius: 12, padding: "12px 16px",
          color: C.text, fontSize: 14, outline: "none",
          fontFamily: G.body, width: "100%",
          transition: "border-color .2s, box-shadow .2s",
          boxShadow: focused ? `0 0 0 3px ${accent.glow}` : "none",
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
      background: veg ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
      border: `1px solid ${veg ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
      borderRadius: 20, padding: "3px 10px", fontSize: 11,
      color: veg ? "#10b981" : "#f87171", fontFamily: G.body, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: veg ? "#10b981" : "#f87171", display: "inline-block", boxShadow: veg ? "0 0 6px #10b981" : "0 0 6px #f87171" }} />
      {type}
    </span>
  );
}

/* ── SectionLabel ────────────────────────────────────────────── */
export function SectionLabel({ children }) {
  const { accent } = useTheme();
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: `${accent.value}12`,
      border: `1px solid ${accent.value}40`,
      borderRadius: 20, padding: "5px 16px", marginBottom: "1.2rem",
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%", background: accent.value,
        display: "inline-block", boxShadow: `0 0 10px ${accent.glow}`,
      }} />
      <span style={{ fontSize: 11, color: accent.value, fontFamily: G.body, letterSpacing: "1px", fontWeight: 600 }}>
        {children}
      </span>
    </div>
  );
}

/* ── Card3D ──────────────────────────────────────────────────── */
export function Card3D({ children, style = {} }) {
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0) rotateY(0)");
  const { accent } = useTheme();

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    setTransform(`perspective(1000px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(8px)`);
  };
  const handleLeave = () => setTransform("perspective(1000px) rotateX(0) rotateY(0)");

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform,
        transition: "transform .1s ease",
        background: "rgba(13,26,13,0.7)",
        backdropFilter: "blur(20px)",
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: 16,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Navbar ──────────────────────────────────────────────────── */
export function Navbar({ page, setPage, user, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLang();
  const { accent } = useTheme();
  const links = [t("nav_home"), t("nav_about"), t("nav_contact")];
  const linkKeys = ["Home", "About", "Contact"];

  return (
    <nav style={{
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "0 2rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 68, position: "sticky", top: 0, zIndex: 200,
      background: "rgba(6,10,6,0.92)",
      backdropFilter: "blur(20px)",
      boxShadow: `0 1px 0 rgba(255,255,255,0.04), 0 4px 30px rgba(0,0,0,0.4)`,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => setPage("Home")}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, boxShadow: `0 0 16px ${accent.glow}`,
        }}>🏠</div>
        <span style={{
          fontWeight: 800, fontSize: 20, letterSpacing: "1px",
          color: accent.value, fontFamily: G.sans,
          textShadow: `0 0 20px ${accent.glow}`,
        }}>ResQMeal</span>
      </div>

      {/* Desktop nav */}
      <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }} className="desk-nav">
        {links.map((l, i) => {
          const key = linkKeys[i];
          return (
            <button key={key}
              onClick={() => setPage(key)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: page === key ? accent.value : "#5a7a5a",
                fontSize: 13, fontFamily: G.body, fontWeight: page === key ? 600 : 400,
                letterSpacing: ".3px",
                borderBottom: page === key ? `2px solid ${accent.value}` : "2px solid transparent",
                paddingBottom: 2, transition: "color .2s",
                textShadow: page === key ? `0 0 12px ${accent.glow}` : "none",
              }}>
              {l}
            </button>
          );
        })}

        {user ? (
          <>
            <button onClick={() => setPage("DonateMeal")}
              style={{
                background: "transparent",
                border: `1px solid ${accent.value}50`,
                color: accent.value, padding: "7px 18px",
                borderRadius: 50, fontSize: 13, cursor: "pointer",
                fontFamily: G.body, transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${accent.value}15`; e.currentTarget.style.boxShadow = `0 0 14px ${accent.glow}`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
              {t("nav_donate")}
            </button>
            <button onClick={() => setPage("Dashboard")}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: `${accent.value}15`,
                border: `1px solid ${accent.value}40`,
                color: accent.value, padding: "7px 16px",
                borderRadius: 50, fontSize: 13, cursor: "pointer",
                fontFamily: G.body, transition: "all .2s",
              }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#fff",
                boxShadow: `0 0 8px ${accent.glow}`,
              }}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              {user.name?.split(" ")[0]}
            </button>
            <button onClick={logout}
              style={{
                background: "transparent", border: "1px solid rgba(248,113,113,0.4)",
                color: "#f87171", padding: "7px 16px",
                borderRadius: 50, fontSize: 13, cursor: "pointer",
                fontFamily: G.body, transition: "all .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {t("nav_logout")}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setPage("Register")}
              style={{
                background: "transparent",
                border: `1px solid ${accent.value}50`,
                color: accent.value, padding: "7px 18px",
                borderRadius: 50, fontSize: 13, cursor: "pointer",
                fontFamily: G.body, transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${accent.value}15`; e.currentTarget.style.boxShadow = `0 0 14px ${accent.glow}`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
              {t("nav_register")}
            </button>
            <button onClick={() => setPage("Login")}
              style={{
                background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
                color: "#fff", padding: "8px 22px",
                borderRadius: 50, fontSize: 13, cursor: "pointer",
                border: "none", fontFamily: G.body, fontWeight: 600,
                transition: "all .2s",
                boxShadow: `0 4px 16px ${accent.glow}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${accent.glow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 16px ${accent.glow}`; }}>
              {t("nav_login")}
            </button>
          </>
        )}
      </div>

      {/* Hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="ham-btn"
        style={{
          display: "none", background: "none",
          border: `1px solid ${accent.value}40`,
          borderRadius: 8, padding: "6px 10px",
          cursor: "pointer", color: accent.value, fontSize: 18,
        }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div style={{
          position: "absolute", top: 68, left: 0, right: 0,
          background: "rgba(6,10,6,0.97)", backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${accent.value}20`,
          padding: "1.5rem 2rem", display: "flex",
          flexDirection: "column", gap: "1.2rem", zIndex: 300,
        }}>
          {[...linkKeys, ...(user ? ["Dashboard", "DonateMeal"] : ["Register", "Login"])].map(l => (
            <button key={l} onClick={() => { setMenuOpen(false); setPage(l); }}
              style={{
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                color: page === l ? accent.value : "#7a9a7a", fontSize: 16, fontFamily: G.body,
                fontWeight: page === l ? 600 : 400,
              }}>{l}</button>
          ))}
          {user && (
            <button onClick={() => { logout(); setMenuOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "#f87171", fontSize: 16, fontFamily: G.body }}>
              {t("nav_logout")}
            </button>
          )}
        </div>
      )}

      <style>{`
        @media(max-width:700px){.desk-nav{display:none!important}.ham-btn{display:block!important}}
      `}</style>
    </nav>
  );
}

/* ── Footer ──────────────────────────────────────────────────── */
export function Footer({ setPage }) {
  const { user } = useAuth();
  const { accent } = useTheme();
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  const handleNav = (p) => setPage(p);

  return (
    <footer style={{ background: "#040804", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "4rem" }}>
      {/* Impact band */}
      <div style={{
        background: "linear-gradient(135deg, rgba(13,26,13,0.8), rgba(6,10,6,0.9))",
        padding: "3rem 2rem", textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <p style={{ fontSize: 11, color: C.dim, fontFamily: G.body, marginBottom: ".5rem", letterSpacing: "2px" }}>
          IMPACT SO FAR
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1.5rem,4vw,4rem)", flexWrap: "wrap" }}>
          {[["12,400+", "Meals rescued"], ["340+", "Partner PGs"], ["6,200+", "People fed"], ["18", "Cities soon"]].map(([n, l]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: accent.value, margin: 0, fontFamily: G.sans, textShadow: `0 0 20px ${accent.glow}` }}>{n}</p>
              <p style={{ fontSize: 13, color: C.subtle, margin: 0, fontFamily: G.body }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem",
        display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "2.5rem",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: "1rem" }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
              boxShadow: `0 0 10px ${accent.glow}`,
            }}>🏠</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: accent.value, fontFamily: G.sans }}>{C.brand || "ResQMeal"}</span>
          </div>
          <p style={{ fontSize: 13, color: C.subtle, fontFamily: G.body, lineHeight: 1.7, margin: "0 0 1.2rem" }}>
            Connecting surplus food from PGs &amp; hostels to people who need it.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {["𝕏", "in", "f", "▶"].map(s => (
              <a key={s} href="#"
                style={{
                  width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center",
                  justifyContent: "center", color: C.muted, fontSize: 14, textDecoration: "none",
                  fontFamily: G.body, transition: "all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = accent.value; e.currentTarget.style.borderColor = accent.value; e.currentTarget.style.boxShadow = `0 0 12px ${accent.glow}`; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}>
                {s}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 11, color: C.dim, fontFamily: G.body, letterSpacing: "1.5px", marginBottom: "1rem" }}>COMPANY</p>
          {[["About Us", "About"], ["How It Works", "Home"], ["Contact Us", "Contact"]].map(([t2, p]) => (
            <button key={t2} onClick={() => handleNav(p)}
              style={{ display: "block", background: "none", border: "none", textAlign: "left", color: C.subtle, fontSize: 14, fontFamily: G.body, cursor: "pointer", padding: "5px 0", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = accent.value}
              onMouseLeave={e => e.currentTarget.style.color = C.subtle}>
              {t2}
            </button>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 11, color: C.dim, fontFamily: G.body, letterSpacing: "1.5px", marginBottom: "1rem" }}>FOR USERS</p>
          {[["Find Food", "Home"], ["List Surplus", "DonateMeal"], ["Partner with Us", "Contact"]].map(([t2, p]) => (
            <button key={t2} onClick={() => handleNav(p)}
              style={{ display: "block", background: "none", border: "none", textAlign: "left", color: C.subtle, fontSize: 14, fontFamily: G.body, cursor: "pointer", padding: "5px 0", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = accent.value}
              onMouseLeave={e => e.currentTarget.style.color = C.subtle}>
              {t2}
            </button>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 11, color: C.dim, fontFamily: G.body, letterSpacing: "1.5px", marginBottom: "1rem" }}>NEWSLETTER</p>
          <p style={{ fontSize: 13, color: C.subtle, fontFamily: G.body, lineHeight: 1.6, marginBottom: "1rem" }}>
            Weekly impact reports &amp; new city launches.
          </p>
          {subbed ? (
            <p style={{ color: accent.value, fontSize: 13, fontFamily: G.body }}>✓ You&apos;re subscribed!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13,
                  outline: "none", fontFamily: G.body, width: "100%",
                }} />
              <button onClick={() => email && setSubbed(true)}
                style={{
                  background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
                  color: "#fff", border: "none", borderRadius: 8, padding: "9px",
                  fontSize: 13, cursor: "pointer", fontFamily: G.sans, fontWeight: 600,
                  boxShadow: `0 4px 14px ${accent.glow}`,
                }}>
                Subscribe →
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1.2rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: 1100, margin: "0 auto", flexWrap: "wrap", gap: 12,
      }}>
        <p style={{ fontSize: 12, color: C.dim, fontFamily: G.body, margin: 0 }}>
          © 2025 ResQMeal. Made with 💚 to reduce food waste in India.
        </p>
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
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

      :root {
        --accent:      #10b981;
        --accent-dark: #059669;
        --accent-glow: rgba(16,185,129,0.35);
      }

      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

      body {
        background: #060a06;
        color: #e8f5e8;
        -webkit-font-smoothing: antialiased;
        font-family: 'Inter', sans-serif;
      }

      /* 3D perspective for card containers */
      .card-3d-container { perspective: 1200px; }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #040804; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

      /* Animations */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33%       { transform: translateY(-20px) rotate(3deg); }
        66%       { transform: translateY(-10px) rotate(-3deg); }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px var(--accent-glow); }
        50%       { box-shadow: 0 0 40px var(--accent-glow), 0 0 80px var(--accent-glow); }
      }
      @keyframes orb-float {
        0%   { transform: translate(0, 0) scale(1); }
        33%  { transform: translate(60px, -80px) scale(1.1); }
        66%  { transform: translate(-40px, 40px) scale(0.9); }
        100% { transform: translate(0, 0) scale(1); }
      }
      @keyframes gradient-shift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Selection */
      ::selection { background: var(--accent); color: #000; }
    `}</style>
  );
}

export default GlobalStyles;