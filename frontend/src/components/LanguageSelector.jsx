import { useState } from "react";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";

export default function LanguageSelector() {
  const { lang, setLang, LANG_META } = useLang();
  const { accent } = useTheme();
  const [open, setOpen] = useState(false);

  const current = LANG_META[lang];

  return (
    <>
      {/* Fixed bottom-left pill */}
      <div style={{
        position: "fixed", bottom: 24, left: 24,
        zIndex: 1500,
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        gap: 8,
      }}>
        {/* Language list (opens upward) */}
        {open && (
          <div style={{
            background: "linear-gradient(135deg, #0d1a10, #0a1208)",
            border: `1px solid ${accent.value}40`,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: `0 0 40px ${accent.glow}, 0 20px 60px rgba(0,0,0,0.8)`,
            animation: "slideUp .2s ease",
            minWidth: 170,
          }}>
            <style>{`
              @keyframes slideUp {
                from { opacity:0; transform:translateY(10px); }
                to   { opacity:1; transform:translateY(0); }
              }
            `}</style>
            {Object.entries(LANG_META).map(([code, meta]) => (
              <button
                key={code}
                onClick={() => { setLang(code); setOpen(false); }}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: lang === code ? `${accent.value}20` : "transparent",
                  border: "none", cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 10,
                  color: lang === code ? accent.value : "#7a9a7a",
                  fontSize: 13, fontFamily: "'Inter', sans-serif",
                  fontWeight: lang === code ? 600 : 400,
                  borderLeft: lang === code ? `3px solid ${accent.value}` : "3px solid transparent",
                  transition: "background .15s",
                }}
                onMouseEnter={e => { if (lang !== code) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (lang !== code) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 18 }}>{meta.flag}</span>
                <span>{meta.label}</span>
                {lang === code && <span style={{ marginLeft: "auto", fontSize: 11 }}>✓</span>}
              </button>
            ))}
          </div>
        )}

        {/* Trigger button */}
        <button
          onClick={() => setOpen(!open)}
          title="Change language"
          style={{
            background: "linear-gradient(135deg, #0d1a10, #0a1208)",
            border: `1px solid ${open ? accent.value : "rgba(255,255,255,0.12)"}`,
            borderRadius: 50, padding: "9px 16px",
            color: "#e8f5e8", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 500,
            boxShadow: open ? `0 0 20px ${accent.glow}` : "0 4px 20px rgba(0,0,0,0.5)",
            transition: "all .2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = accent.value;
            e.currentTarget.style.boxShadow = `0 0 20px ${accent.glow}`;
          }}
          onMouseLeave={e => {
            if (!open) {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";
            }
          }}
        >
          <span style={{ fontSize: 17 }}>{current.flag}</span>
          <span>{current.label}</span>
          <span style={{ fontSize: 10, opacity: .6, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }}>▴</span>
        </button>
      </div>

      {/* Backdrop to close */}
      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 1499 }}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
