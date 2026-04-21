import { useState, useEffect } from "react";
import { C, G, GreenBtn, SectionLabel } from "../shared";
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

  const StatusBadge = ({ status }) => (
    <span style={{
      fontSize: 11, padding: "3px 10px", borderRadius: 20, fontFamily: G.body, fontWeight: 600,
      background: status === "available" ? "#0a2a10" : "#0a1a2a",
      border: `1px solid ${status === "available" ? "#1a4a1a" : "#1a3a4a"}`,
      color: status === "available" ? C.green : "#60a5fa",
    }}>
      {status === "available" ? "🟢 Available" : "✅ Claimed"}
    </span>
  );

  const MealCard = ({ meal, showDonor }) => (
    <div style={{
      background: "#0a1a0a", border: `1px solid ${C.border}`, borderRadius: 14,
      padding: "1.25rem", display: "flex", flexDirection: "column", gap: 10,
      transition: "border-color .2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHov}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text, fontFamily: G.sans }}>{meal.title}</p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: C.muted, fontFamily: G.body }}>{meal.description}</p>
        </div>
        <StatusBadge status={meal.status} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
        {[
          ["📍", meal.location],
          ["👥", meal.quantity],
          ["⏱", meal.expiryTime],
          ...(showDonor && meal.donor ? [["🏠", meal.donor.name || "—"]] : []),
        ].map(([ico, val], i) => (
          <span key={i} style={{ fontSize: 12, color: C.dim, fontFamily: G.body }}>
            {ico} {val}
          </span>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 11, color: C.dim, fontFamily: G.body }}>
        {new Date(meal.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
      </p>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem 5rem" }}>

      {/* Header */}
      <SectionLabel>MY DASHBOARD</SectionLabel>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: "2.5rem" }}>
        <div>
          <h1 style={{
            fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: C.text,
            margin: "0 0 .4rem", letterSpacing: "-1px", fontFamily: G.sans,
          }}>
            Welcome back, <span style={{ color: C.green }}>{user.name?.split(" ")[0]}</span> 👋
          </h1>
          <p style={{ color: C.muted, fontFamily: G.body, fontSize: 14, margin: 0 }}>{user.email}</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <GreenBtn onClick={() => setPage("DonateMeal")}>+ Donate Meal</GreenBtn>
          <GreenBtn outline onClick={() => { logout(); setPage("Home"); }}>Logout</GreenBtn>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, marginBottom: "2.5rem" }}>
        {[
          { label: "Meals Donated",  value: donated.length,                            emoji: "🍱" },
          { label: "Meals Claimed",  value: claimedM.length,                           emoji: "✅" },
          { label: "Active Listings",value: donated.filter(m => m.status === "available").length, emoji: "🟢" },
          { label: "Impact Score",   value: `${(donated.length + claimedM.length) * 10}pts`, emoji: "⭐" },
        ].map(s => (
          <div key={s.label} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
            padding: "1.25rem", textAlign: "center",
          }}>
            <p style={{ fontSize: 28, margin: "0 0 6px" }}>{s.emoji}</p>
            <p style={{ fontSize: "1.4rem", fontWeight: 800, color: C.green, margin: 0, fontFamily: G.sans }}>{s.value}</p>
            <p style={{ fontSize: 12, color: C.dim, margin: "3px 0 0", fontFamily: G.body }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {[["donated", "🍱 My Donations"], ["claimed", "✅ Claimed Meals"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{
              padding: "9px 20px", borderRadius: 20, fontSize: 13, cursor: "pointer",
              border: `1px solid ${tab === key ? C.green : C.border}`,
              background: tab === key ? "#0f2a0f" : "transparent",
              color: tab === key ? C.green : C.subtle,
              fontFamily: G.body, transition: "all .2s",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem 0", color: C.dim }}>
          <p style={{ fontSize: 32, margin: "0 0 1rem" }}>⏳</p>
          <p style={{ fontFamily: G.body }}>Loading your meals…</p>
        </div>
      ) : (
        <>
          {tab === "donated" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {donated.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 0", color: C.dim }}>
                  <p style={{ fontSize: 36, margin: "0 0 1rem" }}>🍱</p>
                  <p style={{ fontFamily: G.sans, fontSize: 16, fontWeight: 600 }}>No donations yet</p>
                  <p style={{ fontFamily: G.body, fontSize: 13, margin: "8px 0 1.5rem" }}>Share surplus food with the community!</p>
                  <GreenBtn onClick={() => setPage("DonateMeal")}>Donate Your First Meal →</GreenBtn>
                </div>
              ) : donated.map(m => <MealCard key={m._id} meal={m} showDonor={false} />)}
            </div>
          )}

          {tab === "claimed" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {claimedM.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 0", color: C.dim }}>
                  <p style={{ fontSize: 36, margin: "0 0 1rem" }}>✅</p>
                  <p style={{ fontFamily: G.sans, fontSize: 16, fontWeight: 600 }}>No meals claimed yet</p>
                  <p style={{ fontFamily: G.body, fontSize: 13, margin: "8px 0 1.5rem" }}>Browse available listings and claim a meal!</p>
                  <GreenBtn onClick={() => setPage("Home")}>Browse Listings →</GreenBtn>
                </div>
              ) : claimedM.map(m => <MealCard key={m._id} meal={m} showDonor={true} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
