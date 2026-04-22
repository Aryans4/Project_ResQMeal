import { useState } from "react";
import { C, G } from "../shared";
import { useLang } from "../context/LangContext";

export default function LocationPopup({ onAutoFill, onManual, onClose }) {
  const [status, setStatus] = useState("idle");
  const { t } = useLang();

  const handleAutoFill = () => {
    if (!navigator.geolocation) { setStatus("error"); return; }
    setStatus("fetching");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`, { headers: { "Accept-Language": "en" } });
          const data = await resp.json();
          const addr = data.address || {};
          const parts = [addr.road||addr.pedestrian||"", addr.suburb||addr.neighbourhood||"", addr.city||addr.town||addr.village||addr.county||"", addr.state||"", addr.postcode||""].filter(Boolean);
          onAutoFill({ address: parts.join(", "), city: addr.city||addr.town||addr.village||"", state: addr.state||"" });
        } catch { setStatus("error"); }
      },
      () => setStatus("error"),
      { timeout: 10000 }
    );
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(19,27,46,0.4)", backdropFilter: "blur(6px)", zIndex: 2000 }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", zIndex: 2001,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(45,212,191,0.2)", borderRadius: "1.5rem",
        padding: "2rem", width: "min(90vw, 380px)",
        boxShadow: "0 30px 80px rgba(45,212,191,0.2), 0 0 0 1px rgba(255,255,255,0.6)",
        animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 30, height: 30, color: C.muted, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(45,212,191,0.12)", border: "1.5px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: "1.2rem", boxShadow: "0 4px 16px rgba(45,212,191,0.15)" }}>📍</div>

        <h3 style={{ color: C.text, fontFamily: G.sans, fontSize: 18, fontWeight: 800, margin: "0 0 .5rem" }}>{t("loc_popup_title")}</h3>
        <p style={{ color: C.muted, fontSize: 14, fontFamily: G.body, lineHeight: 1.6, margin: "0 0 1.5rem" }}>{t("loc_popup_sub")}</p>

        {status === "error" && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem", padding: "10px 14px", marginBottom: "1rem" }}>
            <p style={{ color: "#dc2626", fontSize: 13, fontFamily: G.body, margin: 0 }}>⚠ {t("loc_error")}</p>
          </div>
        )}

        {status === "fetching" ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid rgba(45,212,191,0.2)`, borderTopColor: C.primary, animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: C.muted, fontFamily: G.body, fontSize: 13 }}>{t("loc_fetching")}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={handleAutoFill}
              style={{ padding: "13px 16px", borderRadius: "1rem", background: `linear-gradient(135deg, ${C.primary}, #1fc8b5)`, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: G.body, boxShadow: "0 4px 20px rgba(45,212,191,0.35)", transition: "transform .2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              {t("loc_auto")}
            </button>
            <button onClick={onManual}
              style={{ padding: "12px 16px", borderRadius: "1rem", background: "transparent", border: "1.5px solid rgba(0,0,0,0.12)", color: C.muted, fontSize: 14, cursor: "pointer", fontFamily: G.body, fontWeight: 600, transition: "background .2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {t("loc_manual")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
