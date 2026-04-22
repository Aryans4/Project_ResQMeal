import { useState } from "react";
import { C, G } from "../shared";
import { useLang } from "../context/LangContext";

export default function LanguageSelector() {
  const { lang, setLang, LANG_META } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANG_META[lang];

  return (
    <>
      <div style={{ position: "fixed", bottom: 24, left: 24, zIndex: 1500, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
        {open && (
          <div style={{
            background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(45,212,191,0.2)", borderRadius: "1rem",
            overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            animation: "slideUp .2s ease", minWidth: 170,
          }}>
            {Object.entries(LANG_META).map(([code, meta]) => (
              <button key={code} onClick={() => { setLang(code); setOpen(false); }}
                style={{
                  width: "100%", padding: "10px 14px", background: lang === code ? "rgba(45,212,191,0.1)" : "transparent",
                  border: "none", cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 10,
                  color: lang === code ? C.pDark : C.muted, fontSize: 13, fontFamily: G.body,
                  fontWeight: lang === code ? 700 : 500,
                  borderLeft: lang === code ? `3px solid ${C.primary}` : "3px solid transparent",
                  transition: "background .15s",
                }}
                onMouseEnter={e => { if (lang !== code) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
                onMouseLeave={e => { if (lang !== code) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ fontSize: 18 }}>{meta.flag}</span>
                <span>{meta.label}</span>
                {lang === code && <span style={{ marginLeft: "auto", fontSize: 11 }}>✓</span>}
              </button>
            ))}
          </div>
        )}

        <button onClick={() => setOpen(!open)}
          style={{
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
            border: `1.5px solid ${open ? C.primary : "rgba(0,0,0,0.1)"}`,
            borderRadius: 999, padding: "9px 16px", color: C.text, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, fontSize: 13,
            fontFamily: G.body, fontWeight: 600,
            boxShadow: open ? "0 4px 20px rgba(45,212,191,0.25)" : "0 4px 20px rgba(0,0,0,0.08)",
            transition: "all .2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = "0 4px 20px rgba(45,212,191,0.25)"; }}
          onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; } }}>
          <span style={{ fontSize: 17 }}>{current.flag}</span>
          <span>{current.label}</span>
          <span style={{ fontSize: 10, opacity: .6, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }}>▴</span>
        </button>
      </div>
      {open && <div style={{ position: "fixed", inset: 0, zIndex: 1499 }} onClick={() => setOpen(false)} />}
    </>
  );
}
