import { useState } from "react";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";

export default function LocationPopup({ onAutoFill, onManual, onClose }) {
  const [status, setStatus] = useState("idle"); // idle | fetching | error
  const { t } = useLang();
  const { accent } = useTheme();

  const handleAutoFill = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }
    setStatus("fetching");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await resp.json();
          const addr = data.address || {};
          const parts = [
            addr.road || addr.pedestrian || addr.footway || "",
            addr.suburb || addr.neighbourhood || addr.quarter || "",
            addr.city || addr.town || addr.village || addr.county || "",
            addr.state || "",
            addr.postcode || "",
          ].filter(Boolean);
          const fullAddress = parts.join(", ");
          const city  = addr.city || addr.town || addr.village || addr.county || "";
          const state = addr.state || "";
          onAutoFill({ address: fullAddress, city, state });
        } catch {
          setStatus("error");
        }
      },
      () => setStatus("error"),
      { timeout: 10000 }
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 2000,
        }}
      />
      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 2001,
        background: "linear-gradient(135deg, #0d1a10, #0a1208)",
        border: `1px solid ${accent.value}40`,
        borderRadius: 20,
        padding: "2rem",
        width: "min(90vw, 380px)",
        boxShadow: `0 0 60px ${accent.glow}, 0 40px 80px rgba(0,0,0,0.8)`,
        animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <style>{`
          @keyframes popIn {
            from { opacity:0; transform:translate(-50%,-50%) scale(.85); }
            to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
          }
        `}</style>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(255,255,255,0.07)", border: "none",
            borderRadius: "50%", width: 30, height: 30,
            color: "#9ab39a", cursor: "pointer", fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>

        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: `${accent.value}20`,
          border: `1px solid ${accent.value}60`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, marginBottom: "1.2rem",
          boxShadow: `0 0 20px ${accent.glow}`,
        }}>📍</div>

        <h3 style={{
          color: "#e8f5e8", fontFamily: "'Orbitron', sans-serif",
          fontSize: 18, fontWeight: 700, margin: "0 0 .5rem",
        }}>{t("loc_popup_title")}</h3>

        <p style={{
          color: "#7a9a7a", fontSize: 14,
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.6, margin: "0 0 1.5rem",
        }}>{t("loc_popup_sub")}</p>

        {status === "error" && (
          <div style={{
            background: "#2a0a0a", border: "1px solid #5a1a1a",
            borderRadius: 10, padding: "10px 14px", marginBottom: "1rem",
          }}>
            <p style={{ color: "#f87171", fontSize: 13, fontFamily: "'Inter', sans-serif", margin: 0 }}>
              ⚠ {t("loc_error")}
            </p>
          </div>
        )}

        {status === "fetching" ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: `3px solid ${accent.value}30`,
              borderTopColor: accent.value,
              animation: "spin 1s linear infinite",
              margin: "0 auto 12px",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#7a9a7a", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
              {t("loc_fetching")}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={handleAutoFill}
              style={{
                padding: "13px 16px", borderRadius: 12,
                background: `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
                border: "none", color: "#fff",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                boxShadow: `0 4px 20px ${accent.glow}`,
                transition: "transform .2s, box-shadow .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${accent.glow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${accent.glow}`; }}
            >
              {t("loc_auto")}
            </button>
            <button
              onClick={onManual}
              style={{
                padding: "12px 16px", borderRadius: 12,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#9ab39a", fontSize: 14, cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "background .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            >
              {t("loc_manual")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
