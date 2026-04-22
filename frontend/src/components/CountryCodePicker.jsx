import { useState } from "react";
import { C, G } from "../shared";
import { useLang } from "../context/LangContext";

const COUNTRY_CODES = [
  { code: "+91",  country: "India",          flag: "🇮🇳" },
  { code: "+1",   country: "USA / Canada",   flag: "🇺🇸" },
  { code: "+44",  country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61",  country: "Australia",      flag: "🇦🇺" },
  { code: "+971", country: "UAE",            flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia",   flag: "🇸🇦" },
  { code: "+65",  country: "Singapore",      flag: "🇸🇬" },
  { code: "+60",  country: "Malaysia",       flag: "🇲🇾" },
  { code: "+92",  country: "Pakistan",       flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh",     flag: "🇧🇩" },
  { code: "+94",  country: "Sri Lanka",      flag: "🇱🇰" },
  { code: "+977", country: "Nepal",          flag: "🇳🇵" },
  { code: "+33",  country: "France",         flag: "🇫🇷" },
  { code: "+49",  country: "Germany",        flag: "🇩🇪" },
  { code: "+81",  country: "Japan",          flag: "🇯🇵" },
  { code: "+86",  country: "China",          flag: "🇨🇳" },
  { code: "+55",  country: "Brazil",         flag: "🇧🇷" },
  { code: "+27",  country: "South Africa",   flag: "🇿🇦" },
];

export default function CountryCodePicker({ value, phone, onCodeChange, onPhoneChange }) {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useLang();

  const selected = COUNTRY_CODES.find(c => c.code === value) || COUNTRY_CODES[0];
  const filtered = COUNTRY_CODES.filter(c => c.country.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, color: C.muted, fontFamily: G.label, letterSpacing: ".08em", fontWeight: 700, textTransform: "uppercase" }}>
        Phone Number <span style={{ color: "#ef4444" }}>*</span>
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ position: "relative" }}>
          <button type="button" onClick={() => setOpen(!open)}
            style={{
              background: "rgba(255,255,255,0.9)", border: "1.5px solid rgba(0,0,0,0.1)",
              borderRadius: "1rem", padding: "11px 10px",
              color: C.text, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: G.body, whiteSpace: "nowrap", minWidth: 90,
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)",
              transition: "border-color .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.primary}
            onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; }}>
            <span style={{ fontSize: 16 }}>{selected.flag}</span>
            <span style={{ fontWeight: 600 }}>{selected.code}</span>
            <span style={{ fontSize: 10, opacity: .5 }}>▾</span>
          </button>
          {open && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0,
              background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(45,212,191,0.2)", borderRadius: "1rem",
              zIndex: 999, width: 230, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", overflow: "hidden",
            }}>
              <div style={{ padding: "8px 10px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <input autoFocus placeholder="Search country…" value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: "100%", background: "rgba(0,0,0,0.04)", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: "0.625rem", padding: "7px 10px", color: C.text, fontSize: 13, outline: "none", fontFamily: G.body }} />
              </div>
              <div style={{ maxHeight: 220, overflowY: "auto" }}>
                {filtered.map(c => (
                  <button key={c.code} type="button" onClick={() => { onCodeChange(c.code); setOpen(false); setSearch(""); }}
                    style={{ width: "100%", padding: "9px 12px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, color: c.code === value ? C.pDark : C.muted, fontSize: 13, fontFamily: G.body, fontWeight: c.code === value ? 700 : 500, transition: "background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(45,212,191,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontSize: 16 }}>{c.flag}</span>
                    <span style={{ flex: 1 }}>{c.country}</span>
                    <span style={{ opacity: .5 }}>{c.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <input type="tel" placeholder={t("phone_placeholder")} value={phone} onChange={e => onPhoneChange(e.target.value)}
          style={{ flex: 1, background: "rgba(255,255,255,0.9)", border: "1.5px solid rgba(0,0,0,0.1)", borderRadius: "1rem", padding: "11px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: G.body, boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)", transition: "border-color .2s" }}
          onFocus={e => e.currentTarget.style.borderColor = C.primary}
          onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"} />
      </div>
      {open && <div style={{ position: "fixed", inset: 0, zIndex: 998 }} onClick={() => setOpen(false)} />}
    </div>
  );
}
