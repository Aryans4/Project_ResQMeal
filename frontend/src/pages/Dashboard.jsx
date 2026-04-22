import { useState, useEffect } from "react";
import { C, G, Card3D, GreenBtn, SectionLabel } from "../shared";
import { useAuth } from "../context/AuthContext";

export default function Dashboard({ setPage }) {
  const { user, authHeader, logout } = useAuth();
  const [donated,  setDonated]  = useState([]);
  const [claimedM, setClaimedM] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("donated");

  useEffect(() => {
    if (!user) { setPage("Login"); return; }
    (async () => {
      try {
        const [donRes, clmRes] = await Promise.all([
          fetch("/api/meals/my",      { headers: authHeader() }),
          fetch("/api/meals/claimed", { headers: authHeader() }),
        ]);
        const [donData, clmData] = await Promise.all([donRes.json(), clmRes.json()]);
        setDonated(Array.isArray(donData)  ? donData  : []);
        setClaimedM(Array.isArray(clmData) ? clmData  : []);
      } catch { /* silent */ }
      finally  { setLoading(false); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  const StatusPill = ({ status }) => (
    <span style={{
      fontSize: 11, padding: "4px 12px", borderRadius: 999,
      fontFamily: G.label, fontWeight: 700, letterSpacing: ".06em",
      background: status === "available" ? "rgba(45,212,191,0.12)" : "rgba(251,146,60,0.12)",
      border: `1.5px solid ${status === "available" ? "rgba(45,212,191,0.35)" : "rgba(251,146,60,0.35)"}`,
      color: status === "available" ? "var(--accent-dark)" : C.sDark,
    }}>
      {status === "available" ? "🟢 Available" : "✅ Claimed"}
    </span>
  );

  const MealCard = ({ meal, showDonor }) => (
    <div style={{
      background: "var(--card-bg)", backdropFilter: "blur(12px)",
      border: "1px solid var(--glass-border)", borderRadius: "1.25rem",
      padding: "1.25rem", display: "flex", flexDirection: "column", gap: 10,
      boxShadow: "0 4px 20px rgba(45,212,191,0.08)",
      transition: "transform .2s, box-shadow .2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(45,212,191,0.16)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(45,212,191,0.08)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: G.sans }}>{meal.title}</p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--muted)", fontFamily: G.body, lineHeight: 1.5 }}>{meal.description}</p>
        </div>
        <StatusPill status={meal.status} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
        {[
          ["📍", meal.location],
          ["🍽️", meal.quantity],
          ["⏱", meal.expiryTime ? new Date(meal.expiryTime).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }) : "—"],
          ...(showDonor && meal.donor ? [["🏠", meal.donor.name || "—"]] : []),
        ].map(([ico, val], i) => (
          <span key={i} style={{ fontSize: 12, color: "var(--subtle)", fontFamily: G.body }}>{ico} {val}</span>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 11, color: "var(--dim)", fontFamily: G.body }}>
        {meal.createdAt ? new Date(meal.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : ""}
      </p>
    </div>
  );

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", position: "relative" }}>
      {/* Blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 70%)", top:"-15%", right:"-10%", filter:"blur(40px)", animation:"blob-float 20s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)", bottom:"-10%", left:"-10%", filter:"blur(40px)", animation:"blob-float 24s ease-in-out 6s infinite" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

        {/* Header */}
        <SectionLabel>MY DASHBOARD</SectionLabel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: "2.5rem" }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.4rem)", fontWeight: 900, color: C.text, margin: "0 0 .4rem", letterSpacing: "-0.04em", fontFamily: G.sans }}>
              Welcome back, <span style={{ background:`linear-gradient(135deg, ${C.primary}, #1fc8b5)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{user.name?.split(" ")[0]}</span> 👋
            </h1>
            <p style={{ color: C.muted, fontFamily: G.body, fontSize: 14, margin: 0 }}>{user.email}</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <GreenBtn onClick={() => setPage("DonateMeal")}>+ Donate Meal</GreenBtn>
            <GreenBtn outline onClick={() => { logout(); setPage("Home"); }}>Logout</GreenBtn>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: "2.5rem" }}>
          {[
            { label: "Meals Donated",  value: donated.length,  emoji: "🍱" },
            { label: "Meals Claimed",  value: claimedM.length, emoji: "✅" },
            { label: "Active Listings",value: donated.filter(m => m.status === "available").length, emoji: "🟢" },
            { label: "Impact Score",   value: `${(donated.length + claimedM.length) * 10}pts`, emoji: "⭐" },
          ].map(s => (
            <Card3D key={s.label} style={{ padding: "1.5rem", textAlign: "center" }}>
              <p style={{ fontSize: 30, margin: "0 0 8px" }}>{s.emoji}</p>
              <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--accent-dark)", margin: 0, fontFamily: G.sans }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "var(--subtle)", margin: "4px 0 0", fontFamily: G.body }}>{s.label}</p>
            </Card3D>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
          {[["donated", "🍱 My Donations"], ["claimed", "✅ Claimed Meals"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                padding: "9px 20px", borderRadius: 999, fontSize: 13, cursor: "pointer",
                border: `1.5px solid ${tab === key ? "var(--accent)" : "var(--border-sub)"}`,
                background: tab === key ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "var(--surface)",
                color: tab === key ? "var(--accent-dark)" : "var(--muted)",
                fontFamily: G.body, fontWeight: tab === key ? 700 : 500,
                transition: "all .2s",
                boxShadow: tab === key ? "0 4px 16px var(--accent-glow)" : "none",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid rgba(45,212,191,0.2)`, borderTopColor: C.primary, animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: C.muted, fontFamily: G.body, fontSize: 14 }}>Loading your meals…</p>
          </div>
        ) : (
          <>
            {tab === "donated" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {donated.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem 0" }}>
                    <p style={{ fontSize: 48, margin: "0 0 1rem" }}>🍱</p>
                    <p style={{ fontFamily: G.sans, fontSize: 17, fontWeight: 700, color: "var(--text)", margin: "0 0 8px" }}>No donations yet</p>
                    <p style={{ fontFamily: G.body, fontSize: 14, color: "var(--muted)", margin: "0 0 1.5rem" }}>Share surplus food with the community!</p>
                    <GreenBtn onClick={() => setPage("DonateMeal")}>Donate Your First Meal →</GreenBtn>
                  </div>
                ) : donated.map(m => <MealCard key={m._id} meal={m} showDonor={false} />)}
              </div>
            )}
            {tab === "claimed" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {claimedM.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem 0" }}>
                    <p style={{ fontSize: 48, margin: "0 0 1rem" }}>✅</p>
                    <p style={{ fontFamily: G.sans, fontSize: 17, fontWeight: 700, color: "var(--text)", margin: "0 0 8px" }}>No meals claimed yet</p>
                    <p style={{ fontFamily: G.body, fontSize: 14, color: "var(--muted)", margin: "0 0 1.5rem" }}>Browse available listings and claim a meal!</p>
                    <GreenBtn onClick={() => setPage("Home")}>Browse Listings →</GreenBtn>
                  </div>
                ) : claimedM.map(m => <MealCard key={m._id} meal={m} showDonor={true} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
