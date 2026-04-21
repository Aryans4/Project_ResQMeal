import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const G = { sans: "'Syne',sans-serif", body: "'DM Sans',sans-serif" };
export const C = {
  bg: "#0a0f0a", card: "#0d1f0d", border: "#1a3a1a", borderHov: "#2d5a2d",
  green: "#4ade80", greenDark: "#16a34a", greenDeep: "#15803d",
  text: "#e8f5e8", muted: "#6a8a6a", dim: "#3a5a3a", subtle: "#5a7a5a",
};
export const uc = u => u > 65 ? "#ef4444" : u > 40 ? "#f59e0b" : "#4ade80";

/* ── GreenBtn ──────────────────────────────────────────────── */
export function GreenBtn({ children, onClick, outline, style = {}, disabled }) {
  const [hov, setHov] = useState(false);
  const base = outline
    ? { background: "transparent", border: `1px solid ${C.green}`, color: C.green }
    : { background: hov ? C.greenDeep : C.greenDark, color: "#fff", border: "none" };
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...base, padding: "11px 26px", borderRadius: 10, fontSize: 14,
        fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: G.sans, letterSpacing: ".3px", transition: "all .2s", ...style,
      }}>
      {children}
    </button>
  );
}

/* ── Input ─────────────────────────────────────────────────── */
export function Input({ label, type = "text", placeholder, value, onChange, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>
          {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
        </label>
      )}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{
          background: "#0f1f0f", border: `1px solid ${C.border}`, borderRadius: 10,
          padding: "11px 14px", color: C.text, fontSize: 14, outline: "none",
          fontFamily: G.body, width: "100%",
        }} />
    </div>
  );
}

/* ── Badge ─────────────────────────────────────────────────── */
export function Badge({ type }) {
  const veg = type === "Veg";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: veg ? "#0a2a10" : "#2a0a0a",
      border: `1px solid ${veg ? "#1a4a1a" : "#4a1a1a"}`,
      borderRadius: 20, padding: "3px 10px", fontSize: 12,
      color: veg ? C.green : "#f87171", fontFamily: G.body, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: veg ? C.green : "#f87171", display: "inline-block" }} />
      {type}
    </span>
  );
}

/* ── SectionLabel ──────────────────────────────────────────── */
export function SectionLabel({ children }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "#0f2a0f", border: "1px solid #1e4a1e", borderRadius: 20,
      padding: "5px 14px", marginBottom: "1.2rem",
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%", background: C.green,
        display: "inline-block", boxShadow: `0 0 6px ${C.green}`,
      }} />
      <span style={{ fontSize: 11, color: "#86c486", fontFamily: G.body, letterSpacing: ".5px" }}>
        {children}
      </span>
    </div>
  );
}

/* ── Navbar ────────────────────────────────────────────────── */
export function Navbar({ page, setPage, user, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Home", "About", "Contact"];
  return (
    <nav style={{
      borderBottom: `1px solid ${C.border}`, padding: "0 2rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 64, position: "sticky", top: 0, zIndex: 200,
      background: "rgba(10,15,10,0.95)", backdropFilter: "blur(14px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => setPage("Home")}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg,#16a34a,#4ade80)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>🏠</div>
        <span style={{ fontWeight: 800, fontSize: 21, letterSpacing: "-0.5px", color: C.green, fontFamily: G.sans }}>
          ResQMeal
        </span>
      </div>

      {/* Desktop nav */}
      <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }} className="desk-nav">
        {links.map(l => (
          <button key={l} onClick={() => { if (!user && l !== "Home") setPage("Login"); else setPage(l); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: page === l ? C.green : C.subtle, fontSize: 14, fontFamily: G.body,
              fontWeight: page === l ? 600 : 400,
              borderBottom: page === l ? `1.5px solid ${C.green}` : "1.5px solid transparent",
              paddingBottom: 2, transition: "color .2s",
            }}>
            {l}
          </button>
        ))}

        {user ? (
          <>
            <button onClick={() => setPage("DonateMeal")}
              style={{
                background: "transparent", border: `1px solid ${C.border}`, color: C.green,
                padding: "7px 18px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                fontFamily: G.body, transition: "all .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#1a3a1a"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              + Donate Meal
            </button>
            <button onClick={() => setPage("Dashboard")}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#0f2a0f", border: `1px solid ${C.border}`, color: C.green,
                padding: "7px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                fontFamily: G.body, transition: "all .2s",
              }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", background: C.greenDark,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#fff",
              }}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              {user.name?.split(" ")[0]}
            </button>
            <button onClick={logout}
              style={{
                background: "transparent", border: "1px solid #4a1a1a", color: "#f87171",
                padding: "7px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                fontFamily: G.body, transition: "all .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#2a0a0a"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setPage("Register")}
              style={{
                background: "transparent", border: `1px solid ${C.border}`, color: C.green,
                padding: "7px 18px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                fontFamily: G.body, transition: "all .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#1a3a1a"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              Register
            </button>
            <button onClick={() => setPage("Login")}
              style={{
                background: C.greenDark, color: "#fff", padding: "7px 20px",
                borderRadius: 20, fontSize: 13, cursor: "pointer", border: "none",
                fontFamily: G.body, fontWeight: 500, transition: "background .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.greenDeep}
              onMouseLeave={e => e.currentTarget.style.background = C.greenDark}>
              Login
            </button>
          </>
        )}
      </div>

      {/* Hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="ham-btn"
        style={{
          display: "none", background: "none", border: `1px solid ${C.border}`,
          borderRadius: 8, padding: "6px 10px", cursor: "pointer",
          color: C.green, fontSize: 18,
        }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div style={{
          position: "absolute", top: 64, left: 0, right: 0,
          background: "#0d1f0d", borderBottom: `1px solid ${C.border}`,
          padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.2rem", zIndex: 300,
        }}>
          {[...links, ...(user ? ["Dashboard", "DonateMeal"] : ["Register", "Login"])].map(l => (
            <button key={l} onClick={() => { 
                setMenuOpen(false); 
                if (!user && l !== "Home" && l !== "Register" && l !== "Login") setPage("Login"); 
                else setPage(l); 
              }}
              style={{
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                color: page === l ? C.green : C.text, fontSize: 16, fontFamily: G.body,
                fontWeight: page === l ? 600 : 400,
              }}>
              {l}
            </button>
          ))}
          {user && (
            <button onClick={() => { logout(); setMenuOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "#f87171", fontSize: 16, fontFamily: G.body }}>
              Logout
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

/* ── Footer ────────────────────────────────────────────────── */
export function Footer({ setPage }) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  const handleNav = (p) => {
    if (!user && p !== "Home" && p !== "Register" && p !== "Login") setPage("Login");
    else setPage(p);
  };

  return (
    <footer style={{ background: "#060d06", borderTop: `1px solid ${C.border}`, marginTop: "4rem" }}>
      {/* Impact band */}
      <div style={{ background: "#0d1f0d", padding: "3rem 2rem", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: C.dim, fontFamily: G.body, marginBottom: ".5rem", letterSpacing: ".5px" }}>
          IMPACT SO FAR
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1.5rem,4vw,4rem)", flexWrap: "wrap" }}>
          {[["12,400+", "Meals rescued"], ["340+", "Partner PGs"], ["6,200+", "People fed"], ["18", "Cities soon"]].map(([n, l]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: C.green, margin: 0, fontFamily: G.sans }}>{n}</p>
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
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: "1rem" }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg,#16a34a,#4ade80)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            }}>🏠</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: C.green, fontFamily: G.sans }}>ResQMeal</span>
          </div>
          <p style={{ fontSize: 13, color: C.subtle, fontFamily: G.body, lineHeight: 1.7, margin: "0 0 1.2rem" }}>
            Connecting surplus food from PGs &amp; hostels to people who need it — one meal at a time.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {["𝕏", "in", "f", "▶"].map(s => (
              <a key={s} href="#"
                style={{
                  width: 34, height: 34, borderRadius: 8, background: "#0f2a0f",
                  border: `1px solid ${C.border}`, display: "flex", alignItems: "center",
                  justifyContent: "center", color: C.muted, fontSize: 14, textDecoration: "none",
                  fontFamily: G.body, transition: "all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.green; e.currentTarget.style.borderColor = C.green; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}>
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <p style={{ fontSize: 12, color: C.dim, fontFamily: G.body, letterSpacing: ".5px", marginBottom: "1rem" }}>COMPANY</p>
          {[["About Us", "About"], ["How It Works", "Home"], ["Contact Us", "Contact"], ["Careers", "Contact"], ["Press Kit", "Contact"]].map(([t, p]) => (
            <button key={t} onClick={() => handleNav(p)}
              style={{ display: "block", background: "none", border: "none", textAlign: "left", color: C.subtle, fontSize: 14, fontFamily: G.body, cursor: "pointer", padding: "5px 0", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.green}
              onMouseLeave={e => e.currentTarget.style.color = C.subtle}>
              {t}
            </button>
          ))}
        </div>

        {/* For Users */}
        <div>
          <p style={{ fontSize: 12, color: C.dim, fontFamily: G.body, letterSpacing: ".5px", marginBottom: "1rem" }}>FOR USERS</p>
          {[["Find Food", "Home"], ["List Surplus", "DonateMeal"], ["Volunteer", "Contact"], ["Partner with Us", "Contact"], ["NGO Program", "Contact"]].map(([t, p]) => (
            <button key={t} onClick={() => handleNav(p)}
              style={{ display: "block", background: "none", border: "none", textAlign: "left", color: C.subtle, fontSize: 14, fontFamily: G.body, cursor: "pointer", padding: "5px 0", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.green}
              onMouseLeave={e => e.currentTarget.style.color = C.subtle}>
              {t}
            </button>
          ))}
        </div>

        {/* Legal */}
        <div>
          <p style={{ fontSize: 12, color: C.dim, fontFamily: G.body, letterSpacing: ".5px", marginBottom: "1rem" }}>LEGAL</p>
          {["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility", "Community Guidelines"].map(t => (
            <button key={t}
              style={{ display: "block", background: "none", border: "none", textAlign: "left", color: C.subtle, fontSize: 14, fontFamily: G.body, cursor: "pointer", padding: "5px 0", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.green}
              onMouseLeave={e => e.currentTarget.style.color = C.subtle}>
              {t}
            </button>
          ))}
        </div>

        {/* Newsletter */}
        <div>
          <p style={{ fontSize: 12, color: C.dim, fontFamily: G.body, letterSpacing: ".5px", marginBottom: "1rem" }}>NEWSLETTER</p>
          <p style={{ fontSize: 13, color: C.subtle, fontFamily: G.body, lineHeight: 1.6, marginBottom: "1rem" }}>
            Weekly impact reports &amp; new city launches straight to your inbox.
          </p>
          {subbed ? (
            <p style={{ color: C.green, fontSize: 13, fontFamily: G.body }}>✓ You&apos;re subscribed!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ background: "#0f1f0f", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: G.body, width: "100%" }} />
              <button onClick={() => email && setSubbed(true)}
                style={{ background: C.greenDark, color: "#fff", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, cursor: "pointer", fontFamily: G.sans, fontWeight: 600 }}>
                Subscribe →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: `1px solid ${C.border}`, padding: "1.2rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: 1100, margin: "0 auto", flexWrap: "wrap", gap: 12,
      }}>
        <p style={{ fontSize: 13, color: C.dim, fontFamily: G.body, margin: 0 }}>
          © 2025 ResQMeal. Made with 💚 to reduce food waste in India.
        </p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy", "Terms", "Cookies"].map(t => (
            <button key={t} style={{ background: "none", border: "none", color: C.dim, fontSize: 12, fontFamily: G.body, cursor: "pointer" }}>{t}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ── GlobalStyles ───────────────────────────────────────────── */
export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #0a0f0a; color: #e8f5e8; -webkit-font-smoothing: antialiased; }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #0a0f0a; }
      ::-webkit-scrollbar-thumb { background: #1a3a1a; border-radius: 3px; }
    `}</style>
  );
}

export default GlobalStyles;