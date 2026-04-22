import { useState } from "react";
import { C, G } from "../shared";
import { useLang } from "../context/LangContext";
import { useTheme, ACCENT_PRESETS } from "../context/ThemeContext";

const SECTIONS = [
  { id: "hero",          icon: "🏠", key: "sidebar_hero"     },
  { id: "how-it-works",  icon: "⚙️", key: "sidebar_how"      },
  { id: "listings-sec",  icon: "🍱", key: "sidebar_listings" },
  { id: "why-resqmeal",  icon: "💡", key: "sidebar_why"      },
  { id: "stories",       icon: "💬", key: "sidebar_stories"  },
  { id: "cta",           icon: "🚀", key: "sidebar_cta"      },
];

export default function RightSidebar({ currentPage }) {
  const { t } = useLang();
  const { accentIndex, setAccentIndex, darkMode, setDarkMode } = useTheme();
  const [hovered,     setHovered]     = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      {/* Backdrop */}
      {paletteOpen && (
        <div onClick={() => setPaletteOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 1199 }} />
      )}

      {/* Palette + Dark Mode Panel */}
      {paletteOpen && (
        <div style={{
          position: "fixed", right: 60, top: "50%", transform: "translateY(-50%)",
          zIndex: 1400,
          background: "var(--nav-bg)", backdropFilter: "blur(20px)",
          border: "1.5px solid var(--border-sub)", borderRadius: "1.25rem",
          padding: "16px 14px", boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          animation: "slideUp .2s ease", minWidth: 180,
        }}>

          {/* ── Dark / Light toggle ── */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 10, color: "var(--subtle)", fontFamily: G.label, letterSpacing: ".12em", textTransform: "uppercase", margin: "0 0 8px 4px" }}>
              APPEARANCE
            </p>
            <button onClick={() => setDarkMode(!darkMode)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "8px 12px", borderRadius: "0.875rem",
                background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)",
                border: "1.5px solid var(--border-sub)", cursor: "pointer",
              }}>
              <span style={{ fontSize: 13, fontFamily: G.body, fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
                {darkMode ? "🌙 Dark" : "☀️ Light"}
              </span>
              {/* Toggle pill */}
              <div style={{
                width: 40, height: 22, borderRadius: 999,
                background: darkMode ? "var(--accent)" : "rgba(0,0,0,0.12)",
                position: "relative", transition: "background .2s",
                flexShrink: 0,
              }}>
                <div style={{
                  position: "absolute", top: 3, left: darkMode ? 21 : 3,
                  width: 16, height: 16, borderRadius: "50%", background: "#fff",
                  transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }} />
              </div>
            </button>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border-sub)", margin: "4px 0 12px" }} />

          {/* ── Accent colour ── */}
          <p style={{ fontSize: 10, color: "var(--subtle)", fontFamily: G.label, letterSpacing: ".12em", textTransform: "uppercase", margin: "0 0 8px 4px" }}>
            ACCENT COLOUR
          </p>
          {ACCENT_PRESETS.map((preset, i) => (
            <button key={preset.name} onClick={() => { setAccentIndex(i); setPaletteOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "7px 10px", borderRadius: "0.75rem", cursor: "pointer",
                background: i === accentIndex ? `${preset.value}20` : "transparent",
                border: `1.5px solid ${i === accentIndex ? preset.value + "80" : "transparent"}`,
                transition: "all .15s",
              }}
              onMouseEnter={e => { if (i !== accentIndex) e.currentTarget.style.background = "rgba(128,128,128,0.08)"; }}
              onMouseLeave={e => { if (i !== accentIndex) e.currentTarget.style.background = "transparent"; }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: preset.value, flexShrink: 0, boxShadow: i === accentIndex ? `0 0 0 3px ${preset.value}40` : "none" }} />
              <span style={{ fontSize: 13, color: i === accentIndex ? "var(--text)" : "var(--muted)", fontFamily: G.body, fontWeight: i === accentIndex ? 700 : 500 }}>
                {preset.name}
              </span>
              {i === accentIndex && <span style={{ marginLeft: "auto", color: preset.value, fontSize: 13, fontWeight: 700 }}>✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* Sidebar strip */}
      <div style={{
        position: "fixed", right: 0, top: "50%", transform: "translateY(-50%)",
        zIndex: 1200,
        background: "var(--nav-bg)", backdropFilter: "blur(20px)",
        border: "1px solid var(--border-sub)", borderRight: "none",
        borderRadius: "1rem 0 0 1rem", padding: "10px 6px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        boxShadow: "-4px 0 24px rgba(0,0,0,0.1)",
      }}>
        {/* Section scroll buttons */}
        {currentPage === "Home" && SECTIONS.map(sec => (
          <div key={sec.id} style={{ position: "relative" }}>
            <button onClick={() => scrollTo(sec.id)}
              onMouseEnter={() => setHovered(sec.id)}
              onMouseLeave={() => setHovered(null)}
              title={t(sec.key)}
              style={{
                width: 38, height: 38, borderRadius: "0.75rem", border: "none",
                background: hovered === sec.id ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent",
                cursor: "pointer", fontSize: 15,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s",
                transform: hovered === sec.id ? "scale(1.12)" : "scale(1)",
                opacity: hovered === sec.id ? 1 : 0.65,
              }}>
              {sec.icon}
            </button>
            {hovered === sec.id && (
              <div style={{
                position: "absolute", right: "calc(100% + 10px)", top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
                background: "var(--nav-bg)", backdropFilter: "blur(10px)",
                border: "1px solid var(--border-sub)", borderRadius: "0.75rem",
                padding: "5px 12px", color: "var(--text)", fontSize: 12,
                fontFamily: G.body, fontWeight: 600, whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                animation: "slideUp .15s ease",
              }}>
                {t(sec.key)}
              </div>
            )}
          </div>
        ))}

        <div style={{ width: 22, height: 1, background: "var(--border-sub)", margin: "4px 0" }} />

        {/* Palette + dark mode toggle button */}
        <button onClick={() => setPaletteOpen(prev => !prev)}
          title="Theme & colours"
          style={{
            width: 38, height: 38, borderRadius: "0.75rem", border: "none",
            background: paletteOpen ? "rgba(128,128,128,0.1)" : "transparent",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .2s", position: "relative",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(128,128,128,0.1)"}
          onMouseLeave={e => { if (!paletteOpen) e.currentTarget.style.background = "transparent"; }}>
          {/* Rainbow colour wheel */}
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "conic-gradient(from 0deg, #10b981, #06b6d4, #8b5cf6, #f97316, #ec4899, #eab308, #10b981)",
            boxShadow: paletteOpen ? "0 0 0 3px rgba(128,128,128,0.2)" : "none",
          }} />
          {/* Dark mode indicator dot */}
          {darkMode && (
            <div style={{
              position: "absolute", top: 5, right: 5,
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--accent)", border: "1.5px solid var(--nav-bg)",
            }} />
          )}
        </button>
      </div>
    </>
  );
}
