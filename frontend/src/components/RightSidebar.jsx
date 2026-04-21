import { useState } from "react";
import { useLang } from "../context/LangContext";
import { useTheme, ACCENT_PRESETS } from "../context/ThemeContext";

const SECTIONS = [
  { id: "hero",         iconKey: "sidebar_hero",     icon: "🏠" },
  { id: "how-it-works", iconKey: "sidebar_how",      icon: "⚙️" },
  { id: "listings-sec", iconKey: "sidebar_listings",  icon: "🍱" },
  { id: "why-resqmeal", iconKey: "sidebar_why",       icon: "💡" },
  { id: "stories",      iconKey: "sidebar_stories",   icon: "💬" },
  { id: "cta",          iconKey: "sidebar_cta",       icon: "🚀" },
];

export default function RightSidebar({ currentPage }) {
  const { t } = useLang();
  const { accentIndex, setAccentIndex, accent } = useTheme();
  const [hovered,     setHovered]     = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [expanded,    setExpanded]    = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showScrollBtns = currentPage === "Home";

  return (
    <>
      {/* Sidebar */}
      <div
        style={{
          position: "fixed", right: 0, top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1200,
          display: "flex", flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => { setExpanded(false); setPaletteOpen(false); }}
      >
        {/* Main sidebar pill */}
        <div style={{
          background: "linear-gradient(180deg, #0d1a10, #080c08)",
          border: `1px solid ${accent.value}30`,
          borderRight: "none",
          borderRadius: "16px 0 0 16px",
          padding: "12px 8px",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 4,
          boxShadow: `-4px 0 30px rgba(0,0,0,0.6), inset 0 0 20px ${accent.value}08`,
          transition: "all .3s cubic-bezier(.4,0,.2,1)",
        }}>
          
          {/* Section scroll buttons (only on Home) */}
          {showScrollBtns && SECTIONS.map(sec => (
            <div key={sec.id} style={{ position: "relative" }}>
              <button
                onClick={() => scrollTo(sec.id)}
                onMouseEnter={() => setHovered(sec.id)}
                onMouseLeave={() => setHovered(null)}
                title={t(sec.iconKey)}
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: hovered === sec.id ? `${accent.value}20` : "transparent",
                  border: `1px solid ${hovered === sec.id ? accent.value + "60" : "transparent"}`,
                  cursor: "pointer", fontSize: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .2s",
                  transform: hovered === sec.id ? "scale(1.1)" : "scale(1)",
                  boxShadow: hovered === sec.id ? `0 0 12px ${accent.glow}` : "none",
                }}
              >
                {sec.icon}
              </button>

              {/* Tooltip */}
              {hovered === sec.id && expanded && (
                <div style={{
                  position: "absolute", right: "calc(100% + 10px)", top: "50%",
                  transform: "translateY(-50%)",
                  background: "#0d1a10",
                  border: `1px solid ${accent.value}40`,
                  borderRadius: 8, padding: "5px 10px",
                  color: "#e8f5e8", fontSize: 12,
                  fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap",
                  boxShadow: `0 4px 20px rgba(0,0,0,0.7)`,
                  pointerEvents: "none",
                  animation: "fadeInLeft .15s ease",
                }}>
                  {t(sec.iconKey)}
                </div>
              )}
            </div>
          ))}

          {/* Divider */}
          <div style={{
            width: 24, height: 1,
            background: `${accent.value}30`,
            margin: "4px 0",
          }} />

          {/* Theme / Color Picker */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setPaletteOpen(!paletteOpen)}
              onMouseEnter={() => setHovered("theme")}
              onMouseLeave={() => setHovered(null)}
              title={t("sidebar_theme")}
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: hovered === "theme" ? `${accent.value}20` : "transparent",
                border: `1px solid ${hovered === "theme" || paletteOpen ? accent.value + "60" : "transparent"}`,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s",
                boxShadow: paletteOpen ? `0 0 14px ${accent.glow}` : "none",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: `conic-gradient(from 0deg, #10b981, #06b6d4, #8b5cf6, #f97316, #ec4899, #eab308, #10b981)`,
                boxShadow: `0 0 8px ${accent.glow}`,
              }} />
            </button>

            {/* Tooltip */}
            {hovered === "theme" && expanded && !paletteOpen && (
              <div style={{
                position: "absolute", right: "calc(100% + 10px)", top: "50%",
                transform: "translateY(-50%)",
                background: "#0d1a10",
                border: `1px solid ${accent.value}40`,
                borderRadius: 8, padding: "5px 10px",
                color: "#e8f5e8", fontSize: 12,
                fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap",
                boxShadow: `0 4px 20px rgba(0,0,0,0.7)`,
                pointerEvents: "none",
              }}>
                {t("sidebar_theme")}
              </div>
            )}

            {/* Color Palette Popup */}
            {paletteOpen && (
              <div style={{
                position: "absolute", right: "calc(100% + 10px)", top: "50%",
                transform: "translateY(-50%)",
                background: "linear-gradient(135deg, #0d1a10, #080c08)",
                border: `1px solid ${accent.value}40`,
                borderRadius: 14, padding: "12px",
                boxShadow: `0 0 40px ${accent.glow}, 0 20px 60px rgba(0,0,0,0.8)`,
                animation: "fadeInLeft .2s ease",
                display: "flex", flexDirection: "column", gap: 6,
                minWidth: 160,
              }}>
                <p style={{
                  fontSize: 11, color: "#5a7a5a",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: ".5px", margin: "0 0 4px",
                }}>ACCENT COLOUR</p>
                {ACCENT_PRESETS.map((preset, i) => (
                  <button
                    key={preset.name}
                    onClick={() => { setAccentIndex(i); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "7px 10px", borderRadius: 8,
                      background: i === accentIndex ? `${preset.value}20` : "transparent",
                      border: `1px solid ${i === accentIndex ? preset.value + "60" : "transparent"}`,
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                    onMouseEnter={e => { if (i !== accentIndex) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={e => { if (i !== accentIndex) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: preset.value,
                      boxShadow: i === accentIndex ? `0 0 10px ${preset.glow}` : "none",
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 12, color: i === accentIndex ? preset.value : "#7a9a7a",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: i === accentIndex ? 600 : 400,
                    }}>{preset.name}</span>
                    {i === accentIndex && (
                      <span style={{ marginLeft: "auto", color: preset.value, fontSize: 11 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInLeft {
          from { opacity:0; transform:translateY(-50%) translateX(8px); }
          to   { opacity:1; transform:translateY(-50%) translateX(0); }
        }
      `}</style>
    </>
  );
}
