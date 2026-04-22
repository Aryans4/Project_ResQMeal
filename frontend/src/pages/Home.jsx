import { useState, useEffect } from "react";
import { C, G, Card3D, GreenBtn, SectionLabel, Badge } from "../shared";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

const MOCK_MEALS = [
  { _id:"m1", title:"Dal Rice + Sabzi", description:"Freshly cooked, serves 3-4. No allergens.", location:"Green Valley PG, Sector 62", quantity:"4 servings", expiryTime:"2025-12-31T21:00", status:"available", donor:{ name:"Priya Sharma" }, dietType:"Veg", minsAgo: 8 },
  { _id:"m2", title:"Paneer Butter Masala", description:"Restaurant quality leftovers. Serves 2.", location:"Sunrise Hostel, Koregaon Park", quantity:"2 servings", expiryTime:"2025-12-31T22:30", status:"available", donor:{ name:"Rahul PG" }, dietType:"Veg", minsAgo: 15 },
  { _id:"m3", title:"Chicken Biryani", description:"Hyderabadi style, freshly made. Serves 5.", location:"City Boys PG, Baner", quantity:"5 servings", expiryTime:"2025-12-31T20:00", status:"available", donor:{ name:"Hostel Bites" }, dietType:"Non-Veg", minsAgo: 3 },
  { _id:"m4", title:"Veg Thali (Complete)", description:"Dal, sabzi, roti, rice, salad. Serves 2.", location:"Student Home PG, Wakad", quantity:"2 servings", expiryTime:"2025-12-31T21:30", status:"available", donor:{ name:"Anil Malhotra" }, dietType:"Veg", minsAgo: 22 },
];

const HOW_STEPS = [
  { icon:"🏠", step:"01", title:"PG lists surplus", desc:"Hosts tag leftover food in under 2 minutes — specifying servings, type, and expiry time." },
  { icon:"🔔", step:"02", title:"You get notified", desc:"Nearby users receive real-time alerts. Browse listings, filter by diet & location." },
  { icon:"🍽️", step:"03", title:"Pick up & enjoy", desc:"Contact the PG, arrive in time, and collect your free meal. Rate the experience." },
  { icon:"🌱", step:"04", title:"Track your impact", desc:"See how many meals you've saved, CO₂ reduced, and your community ranking." },
];

const WHY_CARDS = [
  { icon:"✨", label:"Always Free",        desc:"No subscription, no hidden fees. Claiming food is free for everyone, forever." },
  { icon:"⚡", label:"Real-Time Alerts",  desc:"Listings go live instantly. Get notified the moment food is available near you." },
  { icon:"🥗", label:"Diet Filters",      desc:"Filter for Veg / Non-Veg. Every listing clearly marked for dietary needs." },
  { icon:"📍", label:"Hyper Local",       desc:"See only listings within your radius. No irrelevant results from other cities." },
  { icon:"🌿", label:"Zero Waste Impact", desc:"Every meal claimed removes food from landfill. Track your personal CO₂ saved." },
  { icon:"❤️", label:"Community Driven",  desc:"Built by and for students, working professionals, and hostel managers alike." },
];

const STORIES = [
  { name:"Riya Agarwal",   role:"Student, Pune",      avatar:"RA", text:"I save ₹600/month just by using ResQMeal 3-4 times a week. Food is always fresh!" },
  { name:"Deepak",         role:"Hostel Mgr",          avatar:"D",  text:"Listing leftover food takes 2 mins. Zero waste, good karma, super simple app. Every listing clearly claimed." },
  { name:"Ananya Singh",   role:"Working Pro",         avatar:"AS", text:"Late office days sorted! I just check ResQMeal on the way home. Always something." },
  { name:"Pradeep Kumar",  role:"PG Owner",            avatar:"PK", text:"Since joining ResQMeal our food wastage dropped by 90%. Highly recommend it." },
];

export default function Home({ setPage, showAuthModal }) {
  const { user, authHeader } = useAuth();
  const { t } = useLang();
  const [meals,    setMeals]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState("");
  const [search,   setSearch]   = useState("");
  const [locFilter,setLocFilter]= useState("all");
  const [claimed,  setClaimed]  = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/meals");
        let data;
        try { data = await res.json(); } catch { throw new Error("Backend is not running. Please start the server on port 5000."); }
        if (!res.ok) throw new Error(data.error || "Failed to load meals");
        setMeals(data);
      } catch (e) {
        setApiError(e.message);
        setMeals(MOCK_MEALS);
      } finally { setLoading(false); }
    })();
  }, []);

  const scrollToListings = () => document.getElementById("listings-sec")?.scrollIntoView({ behavior:"smooth" });

  const handleClaim = async (id) => {
    if (!user) { showAuthModal?.(); return; }
    try {
      const res  = await fetch(`/api/meals/${id}/claim`, { method:"PATCH", headers: authHeader() });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Could not claim meal."); return; }
      setClaimed(p => ({ ...p, [id]: true }));
    } catch { alert("Could not reach server."); }
  };

  const locations = ["all", ...new Set(MOCK_MEALS.map(m => m.location.split(",").pop().trim()))];
  const filtered  = meals.filter(m => (search ? m.title.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase()) : true) && (locFilter === "all" ? true : m.location.includes(locFilter)));

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Ambient background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position:"absolute", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)", top:"-10%", left:"-15%", animation:"blob-float 18s ease-in-out infinite", filter:"blur(40px)" }} />
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%)", top:"30%", right:"-10%", animation:"blob-float 22s ease-in-out 3s infinite", filter:"blur(40px)" }} />
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 70%)", bottom:"-5%", left:"30%", animation:"blob-float 26s ease-in-out 6s infinite", filter:"blur(40px)" }} />
      </div>

      {/* ── HERO ── */}
      <section id="hero" style={{ position:"relative", zIndex:1, minHeight:"85vh", display:"flex", alignItems:"center", padding:"5rem clamp(1.5rem,5vw,4rem) 4rem", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ flex:1, maxWidth:640 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(45,212,191,0.1)", border:"1.5px solid rgba(45,212,191,0.3)", borderRadius:999, padding:"5px 16px", marginBottom:"1.5rem" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:C.primary, boxShadow:`0 0 0 3px rgba(45,212,191,0.25)` }} />
            <span style={{ fontSize:11, color:C.pDark, fontFamily:G.label, letterSpacing:".12em", fontWeight:700 }}>{t("hero_label")}</span>
          </div>

          <h1 style={{ fontSize:"clamp(2.4rem,5vw,4rem)", fontWeight:900, lineHeight:1.1, letterSpacing:"-0.04em", fontFamily:G.sans, margin:"0 0 .3rem" }}>
            <span style={{ color:C.text }}>{t("hero_title1")}</span>
          </h1>
          <h1 style={{ fontSize:"clamp(2.4rem,5vw,4rem)", fontWeight:900, lineHeight:1.1, letterSpacing:"-0.04em", fontFamily:G.sans, margin:"0 0 1.5rem", background:`linear-gradient(135deg, ${C.primary}, #1fc8b5)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {t("hero_title2")}
          </h1>
          <p style={{ fontSize:"clamp(1rem,2vw,1.2rem)", color:C.muted, fontFamily:G.body, lineHeight:1.7, margin:"0 0 2.5rem", maxWidth:480 }}>
            {t("hero_sub")}
          </p>

          <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:"3.5rem" }}>
            <GreenBtn onClick={scrollToListings}>{t("btn_browse")}</GreenBtn>
            <GreenBtn outline onClick={() => user ? setPage("DonateMeal") : showAuthModal?.()}>{t("btn_list")}</GreenBtn>
          </div>

          {/* Stats row */}
          <div style={{ display:"flex", gap:"2.5rem", flexWrap:"wrap" }}>
            {[["142+","Meals rescued today"],["38","Active listings"],["6.2k","Community members"],["4.8★","Avg. rating"]].map(([n,l]) => (
              <div key={n}>
                <div style={{ fontSize:"clamp(1.5rem,3vw,2rem)", fontWeight:800, color:C.pDark, fontFamily:G.sans, letterSpacing:"-1px" }}>{n}</div>
                <div style={{ fontSize:12, color:C.subtle, fontFamily:G.body }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"center", position:"relative" }} className="hero-vis">
          <div style={{ position:"relative", width:340, height:340 }}>
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:`radial-gradient(circle, rgba(45,212,191,0.2) 0%, transparent 70%)`, animation:"blob-float 12s ease-in-out infinite", filter:"blur(10px)" }} />
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:120, filter:"drop-shadow(0 20px 40px rgba(45,212,191,0.3))", animation:"blob-float 8s ease-in-out infinite" }}>🍱</div>
            {/* Floating chips */}
            {[["top:-10px","right:0","🔥 Just listed","rgba(251,146,60,0.12)","rgba(251,146,60,0.3)",C.sDark],["bottom:30px","left:-30px","📍 0.3 km away","rgba(45,212,191,0.12)","rgba(45,212,191,0.3)",C.pDark],["top:40px","left:-20px","✓ Veg Meal","rgba(45,212,191,0.12)","rgba(45,212,191,0.3)",C.pDark]].map(([t2,l,text,bg,border,color]) => (
              <div key={text} style={{ position:"absolute", ...Object.fromEntries([t2,l].map(s => s.split(":"))) }}>
                <div style={{ background:`rgba(255,255,255,0.9)`, backdropFilter:"blur(12px)", border:`1.5px solid ${border}`, borderRadius:999, padding:"6px 14px", fontSize:12, color, fontFamily:G.body, fontWeight:700, boxShadow:"0 8px 24px rgba(0,0,0,0.08)", whiteSpace:"nowrap" }}>
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`@media(max-width:700px){.hero-vis{display:none!important}}`}</style>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ position:"relative", zIndex:1, padding:"5rem clamp(1.5rem,5vw,4rem)", background:"rgba(255,255,255,0.4)", backdropFilter:"blur(10px)", borderTop:"1px solid rgba(45,212,191,0.1)", borderBottom:"1px solid rgba(45,212,191,0.1)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <SectionLabel>{t("how_label")}</SectionLabel>
          <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)", fontWeight:800, color:C.text, letterSpacing:"-0.03em", fontFamily:G.sans, margin:"0 0 3rem" }}>{t("how_title")}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
            {HOW_STEPS.map((s,i) => (
              <Card3D key={i} style={{ padding:"1.8rem" }}>
                <div style={{ width:48, height:48, borderRadius:"0.875rem", background:`linear-gradient(135deg, rgba(45,212,191,0.15), rgba(45,212,191,0.05))`, border:"1px solid rgba(45,212,191,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:"1rem" }}>{s.icon}</div>
                <span style={{ fontSize:11, color:C.primary, fontFamily:G.label, letterSpacing:".1em", fontWeight:700 }}>{s.step}</span>
                <h3 style={{ fontSize:17, fontWeight:700, color:C.text, fontFamily:G.sans, margin:".4rem 0 .6rem" }}>{s.title}</h3>
                <p style={{ fontSize:13, color:C.muted, fontFamily:G.body, lineHeight:1.7, margin:0 }}>{s.desc}</p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ── LISTINGS ── */}
      <section id="listings-sec" style={{ position:"relative", zIndex:1, padding:"5rem clamp(1.5rem,5vw,4rem)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <SectionLabel>{t("listings_label")}</SectionLabel>
          <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)", fontWeight:800, color:C.text, letterSpacing:"-0.03em", fontFamily:G.sans, margin:"0 0 1.5rem" }}>{t("listings_title")}</h2>

          {/* Search + filter */}
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:"1.8rem" }}>
            <input placeholder={t("search_placeholder")} value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex:"1 1 260px", background:"rgba(255,255,255,0.9)", border:"1.5px solid rgba(0,0,0,0.08)", borderRadius:"1rem", padding:"12px 16px", color:C.text, fontSize:14, outline:"none", fontFamily:G.body, boxShadow:"0 2px 12px rgba(0,0,0,0.05)", transition:"border-color .2s" }}
              onFocus={e => e.currentTarget.style.borderColor = C.primary}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"} />
            <select value={locFilter} onChange={e => setLocFilter(e.target.value)}
              style={{ background:"rgba(255,255,255,0.9)", border:"1.5px solid rgba(0,0,0,0.08)", borderRadius:"1rem", padding:"12px 16px", color:C.muted, fontSize:14, outline:"none", fontFamily:G.body, cursor:"pointer" }}>
              {locations.map(l => <option key={l} value={l}>{l === "all" ? t("all_locations") : l}</option>)}
            </select>
          </div>

          {apiError && (
            <div style={{ background:"rgba(251,146,60,0.08)", border:"1.5px solid rgba(251,146,60,0.25)", borderRadius:"1rem", padding:"14px 18px", marginBottom:"1.5rem", display:"flex", gap:12, alignItems:"flex-start" }}>
              <span style={{ fontSize:20 }}>⚠️</span>
              <div>
                <p style={{ color:C.sDark, fontSize:14, fontFamily:G.body, fontWeight:600, margin:0 }}>{apiError}</p>
                <p style={{ color:C.subtle, fontSize:12, fontFamily:G.body, margin:"4px 0 0" }}>Showing sample listings below.</p>
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ flex:"1 1 280px", height:220, borderRadius:"1.5rem", background:"rgba(255,255,255,0.6)", border:"1px solid rgba(45,212,191,0.1)", animation:"fadeIn 1s ease infinite alternate" }} />
              ))}
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
              {(filtered.length ? filtered : MOCK_MEALS).map(meal => {
                const isClaimed = claimed[meal._id] || meal.status === "claimed";
                return (
                  <Card3D key={meal._id} style={{ padding:"1.5rem", cursor:"default", borderLeft: meal.dietType === "Non-Veg" ? `3px solid ${C.secondary}` : `3px solid ${C.primary}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.8rem" }}>
                      <Badge type={meal.dietType || "Veg"} />
                      {meal.minsAgo && (
                        <span style={{ fontSize:11, color:C.subtle, fontFamily:G.label }}>🕐 {meal.minsAgo}m ago</span>
                      )}
                    </div>
                    <h3 style={{ fontSize:17, fontWeight:700, color:C.text, fontFamily:G.sans, margin:"0 0 .4rem", letterSpacing:"-0.3px" }}>{meal.title}</h3>
                    <p style={{ fontSize:13, color:C.muted, fontFamily:G.body, lineHeight:1.6, margin:"0 0 1rem", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{meal.description}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:"1.2rem" }}>
                      <span style={{ fontSize:12, color:C.subtle, fontFamily:G.body }}>📍 {meal.location}</span>
                      <span style={{ fontSize:12, color:C.subtle, fontFamily:G.body }}>🍽️ {meal.quantity} · By {meal.donor?.name || "Anonymous"}</span>
                    </div>
                    <button onClick={() => !isClaimed && handleClaim(meal._id)}
                      disabled={isClaimed}
                      style={{
                        width:"100%", padding:"11px", borderRadius:"0.875rem", border:"none",
                        background: isClaimed ? "rgba(45,212,191,0.1)" : `linear-gradient(135deg, ${C.primary}, #1fc8b5)`,
                        color: isClaimed ? C.pDark : "#fff",
                        fontSize:14, fontWeight:700, cursor: isClaimed ? "default" : "pointer",
                        fontFamily:G.sans, transition:"all .2s",
                        boxShadow: isClaimed ? "none" : "0 4px 16px rgba(45,212,191,0.3)",
                      }}>
                      {isClaimed ? t("claimed") : user ? t("claim_btn") : t("login_to_claim")}
                    </button>
                  </Card3D>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY RESQMEAL ── */}
      <section id="why-resqmeal" style={{ position:"relative", zIndex:1, padding:"5rem clamp(1.5rem,5vw,4rem)", background:"rgba(255,255,255,0.4)", backdropFilter:"blur(10px)", borderTop:"1px solid rgba(45,212,191,0.1)", borderBottom:"1px solid rgba(45,212,191,0.1)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <SectionLabel>{t("why_label")}</SectionLabel>
          <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)", fontWeight:800, color:C.text, letterSpacing:"-0.03em", fontFamily:G.sans, margin:"0 0 3rem" }}>{t("why_title")}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
            {WHY_CARDS.map(w => (
              <Card3D key={w.label} style={{ padding:"1.5rem" }}>
                <div style={{ fontSize:30, marginBottom:"0.75rem" }}>{w.icon}</div>
                <h3 style={{ fontSize:15, fontWeight:700, color:C.text, fontFamily:G.sans, margin:"0 0 .5rem" }}>{w.label}</h3>
                <p style={{ fontSize:13, color:C.muted, fontFamily:G.body, lineHeight:1.6, margin:0 }}>{w.desc}</p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORIES ── */}
      <section id="stories" style={{ position:"relative", zIndex:1, padding:"5rem clamp(1.5rem,5vw,4rem)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <SectionLabel>{t("stories_label")}</SectionLabel>
          <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)", fontWeight:800, color:C.text, letterSpacing:"-0.03em", fontFamily:G.sans, margin:"0 0 3rem" }}>{t("stories_title")}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:20 }}>
            {STORIES.map((s,i) => (
              <Card3D key={i} style={{ padding:"1.75rem" }}>
                <div style={{ display:"flex", gap:4, marginBottom:"1rem" }}>
                  {[1,2,3,4,5].map(j => <span key={j} style={{ color:C.secondary, fontSize:14 }}>★</span>)}
                </div>
                <p style={{ fontSize:14, color:C.muted, fontFamily:G.body, lineHeight:1.7, margin:"0 0 1.2rem", fontStyle:"italic" }}>&ldquo;{s.text}&rdquo;</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg, ${C.primary}, ${C.pDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", fontFamily:G.sans }}>{s.avatar}</div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:C.text, fontFamily:G.sans, margin:0 }}>{s.name}</p>
                    <p style={{ fontSize:11, color:C.subtle, fontFamily:G.body, margin:0 }}>{s.role}</p>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" style={{ position:"relative", zIndex:1, padding:"6rem clamp(1.5rem,5vw,4rem)", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, rgba(45,212,191,0.08) 0%, rgba(251,146,60,0.06) 100%)` }} />
        <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center", position:"relative" }}>
          <SectionLabel>{t("cta_label")}</SectionLabel>
          <h2 style={{ fontSize:"clamp(2.2rem,5vw,3.5rem)", fontWeight:900, color:C.text, letterSpacing:"-0.04em", fontFamily:G.sans, margin:"0 0 .3rem", lineHeight:1.1 }}>
            {t("cta_title")}
          </h2>
          <h2 style={{ fontSize:"clamp(2.2rem,5vw,3.5rem)", fontWeight:900, letterSpacing:"-0.04em", fontFamily:G.sans, margin:"0 0 1.5rem", lineHeight:1.1, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {t("cta_green")}
          </h2>
          <p style={{ fontSize:"clamp(1rem,2vw,1.15rem)", color:C.muted, fontFamily:G.body, lineHeight:1.7, maxWidth:520, margin:"0 auto 2.5rem" }}>{t("cta_sub")}</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <GreenBtn onClick={() => user ? setPage("DonateMeal") : showAuthModal?.()}>{t("btn_get_started")}</GreenBtn>
            <GreenBtn outline onClick={() => setPage("About")}>{t("btn_learn")}</GreenBtn>
          </div>
        </div>
      </section>
    </div>
  );
}
