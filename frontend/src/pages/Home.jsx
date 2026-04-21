import { useState, useEffect } from "react";
import { C, G, GreenBtn, Badge, SectionLabel } from "../shared";
import { useAuth } from "../context/AuthContext";

export default function Home({ setPage }) {
  const { user, authHeader } = useAuth();
  const [meals,    setMeals]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState("");
  const [search,   setSearch]   = useState("");
  const [city,     setCity]     = useState("All");
  const [claimed,  setClaimed]  = useState([]); // ids claimed this session

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/meals");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load meals");
        setMeals(data);
      } catch (e) {
        setApiError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleClaim = async (mealId) => {
    if (!user) { setPage("Login"); return; }
    try {
      const res  = await fetch(`/api/meals/${mealId}/claim`, {
        method: "PATCH",
        headers: { ...authHeader() },
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Could not claim meal"); return; }
      setClaimed(p => [...p, mealId]);
      setMeals(p => p.filter(m => m._id !== mealId));
    } catch {
      alert("Server error. Try again.");
    }
  };

  const cities   = ["All", ...new Set(meals.map(l => l.location))];
  const filtered = meals.filter(l => {
    const ms = (l.title || "").toLowerCase().includes(search.toLowerCase()) ||
               (l.description || "").toLowerCase().includes(search.toLowerCase());
    const mc = city === "All" || l.location === city;
    return ms && mc;
  });

  const scrollToListings = () =>
    document.getElementById("listings-sec")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>LIVE LISTINGS NEAR YOU</SectionLabel>
        <h1 style={{
          fontSize: "clamp(2.4rem,5.5vw,4rem)", fontWeight: 800,
          margin: "0 0 1.2rem", lineHeight: 1.08, letterSpacing: "-1.5px",
          color: C.text, fontFamily: G.sans,
        }}>
          Rescue surplus food.<br />
          <span style={{ color: C.green }}>Feed someone today.</span>
        </h1>
        <p style={{
          color: C.subtle, fontSize: 17, fontFamily: G.body, fontWeight: 300,
          margin: "0 0 2.5rem", maxWidth: 520, lineHeight: 1.65,
        }}>
          Connect with PGs & Hostels to claim free surplus meals before they go to waste. 🍱
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: "3rem" }}>
          <GreenBtn onClick={() => user ? scrollToListings() : setPage("Login")}>Browse Listings →</GreenBtn>
          <GreenBtn outline onClick={() => user ? setPage("DonateMeal") : setPage("Login")}>List Surplus Food</GreenBtn>
        </div>

        <div style={{ display: "flex", gap: "clamp(1.5rem,4vw,3.5rem)", flexWrap: "wrap" }}>
          {[["142+","Meals rescued today"],["38","Active listings"],["6.2k","Community members"],["4.8★","Avg. rating"]].map(([n, l]) => (
            <div key={n}>
              <p style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, margin: 0, color: C.green, fontFamily: G.sans }}>{n}</p>
              <p style={{ fontSize: 13, margin: 0, color: C.dim, fontFamily: G.body }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section style={{
        background: "#0d1f0d", padding: "4rem 2rem",
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <h2 style={{
            fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, color: C.text,
            marginBottom: "2.5rem", letterSpacing: "-1px", fontFamily: G.sans,
          }}>
            Three steps to zero waste
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
            {[
              { num:"01", title:"PG lists surplus",  desc:"Hosts log leftover food in under 2 minutes — specifying servings, type, and expiry time.", emoji:"📋" },
              { num:"02", title:"You get notified",  desc:"Nearby users receive real-time alerts. Browse listings, filter by diet & location.",       emoji:"🔔" },
              { num:"03", title:"Pick up & enjoy",   desc:"Contact the PG, arrive in time, and collect your free meal. Rate the experience.",          emoji:"🍽" },
              { num:"04", title:"Track your impact", desc:"See how many meals you've saved, CO₂ reduced, and your community ranking.",                 emoji:"📊" },
            ].map((s, i) => (
              <div key={s.num} style={{
                background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
                padding: "1.5rem", animation: "fadeUp .5s ease both",
                animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <span style={{ fontSize: 32 }}>{s.emoji}</span>
                  <span style={{ fontSize: 13, color: C.dim, fontFamily: G.sans, fontWeight: 700 }}>{s.num}</span>
                </div>
                <h3 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: "0 0 8px", fontFamily: G.sans }}>{s.title}</h3>
                <p style={{ color: C.subtle, fontSize: 13, fontFamily: G.body, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Listings ─────────────────────────────────────── */}
      <section id="listings-sec" style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem 2rem" }}>
        <SectionLabel>AVAILABLE NOW</SectionLabel>
        <h2 style={{
          fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, color: C.text,
          marginBottom: "2rem", letterSpacing: "-1px", fontFamily: G.sans,
        }}>
          Surplus near you
        </h2>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
          <input type="text" placeholder="Search by title or food description…" value={search}
            onClick={() => { if (!user) setPage("Login"); }}
            onChange={e => { if (!user) setPage("Login"); else setSearch(e.target.value); }}
            style={{
              flex: "1 1 200px", minWidth: 160, background: "#0f1f0f",
              border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px",
              color: C.text, fontSize: 14, outline: "none", fontFamily: G.body,
            }} />
          <select value={city} 
            onClick={() => { if (!user) setPage("Login"); }}
            onChange={e => { if (!user) setPage("Login"); else setCity(e.target.value); }}
            style={{
              background: "#0f1f0f", border: `1px solid ${C.border}`, borderRadius: 10,
              padding: "10px 14px", color: C.text, fontSize: 13, cursor: "pointer",
              fontFamily: G.body, outline: "none",
            }}>
            {cities.map(c => (
              <option key={c} value={c} style={{ background: "#0d1f0d" }}>
                {c === "All" ? "All Locations" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: 36, margin: "0 0 1rem" }}>⏳</p>
            <p style={{ color: C.dim, fontFamily: G.body }}>Loading meals from the database…</p>
          </div>
        )}

        {/* API Error */}
        {!loading && apiError && (
          <div style={{ background: "#2a0a0a", border: "1px solid #4a1a1a", borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ color: "#f87171", fontFamily: G.body, margin: 0 }}>⚠ {apiError}</p>
            <p style={{ color: C.dim, fontFamily: G.body, fontSize: 13, margin: "6px 0 0" }}>Make sure the backend is running on port 5000.</p>
          </div>
        )}

        {!loading && !apiError && (
          <>
            <p style={{ color: C.dim, fontSize: 13, fontFamily: G.body, marginBottom: "1.5rem" }}>
              {filtered.length} listing{filtered.length !== 1 ? "s" : ""} available
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 20 }}>
              {filtered.map((item, i) => (
                <div key={item._id}
                  style={{
                    background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
                    padding: "1.4rem", display: "flex", flexDirection: "column", gap: 14,
                    transition: "border-color .2s,transform .2s",
                    animation: "fadeUp .4s ease both", animationDelay: `${i * 0.07}s`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHov; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;    e.currentTarget.style.transform = "translateY(0)"; }}>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text, fontFamily: G.sans }}>{item.title}</h3>
                      <p style={{ margin: "4px 0 0", fontSize: 13, color: C.dim, fontFamily: G.body }}>{item.description}</p>
                    </div>
                    <Badge type="Veg" />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {[
                      ["📍", item.location],
                      ["⏱", item.expiryTime],
                      ["👥", `${item.quantity} available`],
                      ["🏠", `By: ${item.donor?.name || "Anonymous"}`],
                    ].map(([ico, txt], j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13 }}>{ico}</span>
                        <span style={{ fontSize: 13, fontFamily: G.body, color: ico === "⏱" ? "#4ade80" : C.muted }}>{txt}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleClaim(item._id)}
                    style={{
                      width: "100%", padding: 11, borderRadius: 10, border: "none",
                      background: claimed.includes(item._id) ? "#15803d" : C.greenDark,
                      color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
                      fontFamily: G.sans, transition: "background .2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#15803d"}
                    onMouseLeave={e => e.currentTarget.style.background = claimed.includes(item._id) ? "#15803d" : C.greenDark}>
                    {claimed.includes(item._id) ? "✓ Claimed!" : user ? "Claim Meal →" : "Login to Claim →"}
                  </button>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "4rem 0", color: C.dim }}>
                <p style={{ fontSize: 42, margin: "0 0 1rem" }}>🍽</p>
                <p style={{ fontSize: 17, fontWeight: 600, fontFamily: G.sans }}>No listings found</p>
                <p style={{ fontSize: 13, fontFamily: G.body, marginTop: 8 }}>
                  {meals.length === 0 ? "Be the first to donate a meal!" : "Try adjusting your filters"}
                </p>
                {meals.length === 0 && (
                  <GreenBtn onClick={() => setPage("DonateMeal")} style={{ marginTop: "1.5rem" }}>
                    Donate a Meal →
                  </GreenBtn>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Why ResQMeal ─────────────────────────────────── */}
      <section style={{
        background: "#0d1f0d", padding: "4rem 2rem",
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, marginTop: "3rem",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionLabel>WHY RESQMEAL</SectionLabel>
          <h2 style={{
            fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, color: C.text,
            marginBottom: "2.5rem", letterSpacing: "-1px", fontFamily: G.sans,
          }}>
            Built for India's hostel culture
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
            {[
              { emoji:"🆓", title:"Always Free",       desc:"No subscription, no hidden fees. Claiming food is free for everyone, forever." },
              { emoji:"⚡", title:"Real-Time Alerts",  desc:"Listings go live instantly. Get notified the moment food is available near you." },
              { emoji:"🥗", title:"Diet Filters",      desc:"Filter by Veg / Non-Veg. Every listing clearly marked for dietary needs." },
              { emoji:"📍", title:"Hyper Local",       desc:"See only listings within your radius. No irrelevant results from other cities." },
              { emoji:"🌱", title:"Zero Waste Impact", desc:"Every meal claimed removes food from landfill. Track your personal CO₂ saved." },
              { emoji:"🤝", title:"Community Driven",  desc:"Built by and for students, working professionals, and hostel managers alike." },
            ].map(f => (
              <div key={f.title} style={{
                background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.4rem",
                transition: "border-color .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHov}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <span style={{ fontSize: 28, display: "block", marginBottom: 10 }}>{f.emoji}</span>
                <h4 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: "0 0 6px", fontFamily: G.sans }}>{f.title}</h4>
                <p style={{ color: C.subtle, fontSize: 13, fontFamily: G.body, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "3rem auto 0", padding: "4rem 2rem" }}>
        <SectionLabel>STORIES</SectionLabel>
        <h2 style={{
          fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, color: C.text,
          marginBottom: "2.5rem", letterSpacing: "-1px", fontFamily: G.sans,
        }}>
          What people are saying
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
          {[
            { name:"Riya Agarwal",        role:"Student, Delhi University",   quote:"I save ₹800/month just by using ResQMeal 3–4 times a week. Food is always fresh!", avatar:"RA" },
            { name:"Deepak — Hostel Mgr", role:"Sunrise Hostel, Delhi",       quote:"Listing leftover food takes 2 mins. Zero waste, good karma, super simple app.",    avatar:"DH" },
            { name:"Ananya Singh",         role:"Working Professional, Noida", quote:"Late office days sorted! I just check ResQMeal on the way home. Always something.", avatar:"AS" },
            { name:"Pradeep Kumar",        role:"PG Owner, Gurgaon",           quote:"Since joining ResQMeal our food wastage dropped by 90%. Highly recommend it!",     avatar:"PK" },
          ].map(t => (
            <div key={t.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "1.5rem" }}>
              <p style={{ color: C.text, fontSize: 14, fontFamily: G.body, lineHeight: 1.7, margin: "0 0 1.2rem", fontStyle: "italic" }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", background: "#0f2a0f",
                  border: `1px solid ${C.border}`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 13, fontWeight: 700,
                  color: C.green, fontFamily: G.sans,
                }}>{t.avatar}</div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text, fontFamily: G.sans }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.dim, fontFamily: G.body }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ textAlign: "center", padding: "5rem 2rem", maxWidth: 700, margin: "0 auto" }}>
        <SectionLabel>JOIN THE MOVEMENT</SectionLabel>
        <h2 style={{
          fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, color: C.text,
          margin: "0 0 1.2rem", letterSpacing: "-1px", fontFamily: G.sans,
        }}>
          Every meal rescued <span style={{ color: C.green }}>matters.</span>
        </h2>
        <p style={{ color: C.subtle, fontSize: 16, fontFamily: G.body, margin: "0 0 2.5rem", lineHeight: 1.6 }}>
          Whether you're a PG owner with leftover food or someone looking for a meal — you belong here.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <GreenBtn onClick={() => setPage(user ? "Dashboard" : "Register")}>
            {user ? "Go to Dashboard →" : "Get Started Free →"}
          </GreenBtn>
          <GreenBtn outline onClick={() => user ? setPage("About") : setPage("Login")}>
            Learn Our Mission
          </GreenBtn>
        </div>
      </section>
    </div>
  );
}
