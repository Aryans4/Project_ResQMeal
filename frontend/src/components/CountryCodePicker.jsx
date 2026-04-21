import { useState } from "react";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";

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
  { code: "+34",  country: "Spain",          flag: "🇪🇸" },
  { code: "+39",  country: "Italy",          flag: "🇮🇹" },
  { code: "+81",  country: "Japan",          flag: "🇯🇵" },
  { code: "+86",  country: "China",          flag: "🇨🇳" },
  { code: "+7",   country: "Russia",         flag: "🇷🇺" },
  { code: "+55",  country: "Brazil",         flag: "🇧🇷" },
  { code: "+27",  country: "South Africa",   flag: "🇿🇦" },
  { code: "+234", country: "Nigeria",        flag: "🇳🇬" },
  { code: "+20",  country: "Egypt",          flag: "🇪🇬" },
];

export default function CountryCodePicker({ value, phone, onCodeChange, onPhoneChange }) {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useLang();
  const { accent } = useTheme();

  const selected = COUNTRY_CODES.find(c => c.code === value) || COUNTRY_CODES[0];
  const filtered = COUNTRY_CODES.filter(c =>
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, color: "#8a9a8a", fontFamily: "'Inter', sans-serif" }}>
        Phone Number <span style={{ color: "#ef4444" }}>*</span>
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        {/* Code picker button */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "11px 10px",
              color: "#e8f5e8", fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap",
              transition: "border-color .2s",
              minWidth: 90,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = accent.value}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            <span style={{ fontSize: 16 }}>{selected.flag}</span>
            <span>{selected.code}</span>
            <span style={{ fontSize: 10, opacity: .6 }}>▾</span>
          </button>

          {open && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0,
              background: "#0d1a0d",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, zIndex: 999, width: 230,
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
              overflow: "hidden",
            }}>
              <div style={{ padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <input
                  autoFocus
                  placeholder="Search country…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                    padding: "7px 10px", color: "#e8f5e8", fontSize: 13, outline: "none",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <div style={{ maxHeight: 220, overflowY: "auto" }}>
                {filtered.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { onCodeChange(c.code); setOpen(false); setSearch(""); }}
                    style={{
                      width: "100%", padding: "9px 12px", background: "transparent",
                      border: "none", cursor: "pointer", textAlign: "left",
                      display: "flex", alignItems: "center", gap: 10,
                      color: c.code === value ? accent.value : "#9ab39a",
                      fontSize: 13, fontFamily: "'Inter', sans-serif",
                      transition: "background .15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: 16 }}>{c.flag}</span>
                    <span style={{ flex: 1 }}>{c.country}</span>
                    <span style={{ opacity: .6 }}>{c.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone number input */}
        <input
          type="tel"
          placeholder={t("phone_placeholder")}
          value={phone}
          onChange={e => onPhoneChange(e.target.value)}
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "11px 14px",
            color: "#e8f5e8", fontSize: 14, outline: "none",
            fontFamily: "'Inter', sans-serif",
            transition: "border-color .2s",
          }}
          onFocus={e => e.currentTarget.style.borderColor = accent.value}
          onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
        />
      </div>
      {/* Dismiss dropdown on outside click */}
      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 998 }}
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
