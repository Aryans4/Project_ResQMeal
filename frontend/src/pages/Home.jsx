import { useState, useEffect } from "react";
import { C, G, GreenBtn, Badge, SectionLabel, Card3D } from "../shared";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";

export default function Home({ setPage, requireAuth, showAuthModal }) {
  const { user, authHeader } = useAuth();
  const { t } = useLang();
  const { accent } = useTheme();

  const [meals,    setMeals]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState("");
  const [search,   setSearch]   = useState("");
  const [city,     setCity]     = useState("All");
  const [claimed,  setClaimed]  = useState([]);

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
    if (!user) { showAuthModal(); return; }
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

  // Floating orbs for hero background
  const orbs = [
    { size: 300, top: "5%",  left: "60%", delay: "0s",  dur: "18s" },
    { size: 200, top: "40%", left: "75%", delay: "6s",  dur: "24s" },
    { size: 150, top: "70%", left: "5%",  delay: "3s",  dur: "20s" },
    { size: 100, top: "20%", left: "10%", delay: "9s",  dur: "16s" },
  ];

  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section id="hero" style={{
        padding: "6rem 2rem 4rem",
        maxWidth: 1100, margin: "0 auto",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background orbs */}
        {orbs.map((orb, i) => (
          <div key={i} style={{
            position: "absolute",
            width: orb.size, height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent.value}18 0%, transparent 70%)`,
            top: orb.top, left: orb.left,
            animation: `orb-float ${orb.dur} ease-in-out ${orb.delay} infinite`,
            pointerEvents: "none",
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 1 }}>
          <SectionLabel>{t("hero_label")}</SectionLabel>
          <h1 style={{
            fontSize: "clamp(2.6rem,6vw,4.5rem)", fontWeight: 900,
            margin: "0 0 1.2rem", lineHeight: 1.06,
            letterSpacing: "-2px", color: "#e8f5e8",
            fontFamily: G.sans,
          }}>
            {t("hero_title1")}<br />
            <span style={{
              background: `linear-gradient(135deg, ${accent.value}, ${accent.dark})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: `drop-shadow(0 0 20px ${accent.glow})`,
            }}>{t("hero_title2")}</span>
          </h1>
          <p style={{
            color: "#5a7a5a", fontSize: 17, fontFamily: G.body, fontWeight: 300,
            margin: "0 0 2.5rem", maxWidth: 520, lineHeight: 1.7,
          }}>
            {t("hero_sub")}
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: "3rem" }}>
            <GreenBtn onClick={() => user ? scrollToListings() : showAuthModal()}>
              {t("btn_browse")}
            </GreenBtn>
            <GreenBtn outline onClick={() => user ? setPage("DonateMeal") : showAuthModal()}>
              {t("btn_list")}
            </GreenBtn>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "clamp(1.5rem,4vw,3.5rem)", flexWrap: "wrap" }}>
            {[
              ["142+", t("hero_label").includes("LIVE") ? "Meals rescued today" : "Meals rescued today"],
              ["38",   "Active listings"],
              ["6.2k", "Community members"],
              ["4.8★", "Avg. rating"],
            ].map(([n, l]) => (
              <div key={n} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: "1rem 1.4rem",
                backdropFilter: "blur(10px)",
              }}>
                <p style={{
                  fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800,
                  margin: 0, color: accent.value, fontFamily: G.sans,
                  textShadow: `0 0 20px ${accent.glow}`,
                }}>{n}</p>
                <p style={{ fontSize: 12, margin: 0, color: "#3a5a3a", fontFamily: G.body }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section id="how-it-works" style={{
        background: "linear-gradient(180deg, rgba(13,26,13,0.4) 0%, rgba(6,10,6,0) 100%)",
        padding: "5rem 2rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionLabel>{t("how_label")}</SectionLabel>
          <h2 style={{
            fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 800, color: "#e8f5e8",
            marginBottom: "2.5rem", letterSpacing: "-1px", fontFamily: G.sans,
          }}>
            {t("how_title")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 20 }}>
            {[
              { num:"01", title:"PG lists surplus",  desc:"Hosts log leftover food in under 2 minutes — specifying servings, type, and expiry time.", emoji:"📋" },
              { num:"02", title:"You get notified",  desc:"Nearby users receive real-time alerts. Browse listings, filter by diet & location.",       emoji:"🔔" },
              { num:"03", title:"Pick up & enjoy",   desc:"Contact the PG, arrive in time, and collect your free meal. Rate the experience.",          emoji:"🍽" },
              { num:"04", title:"Track your impact", desc:"See how many meals you've saved, CO₂ reduced, and your community ranking.",                 emoji:"📊" },
            ].map((s, i) => (
              <Card3D key={s.num} style={{
                padding: "1.6rem",
                animation: "fadeUp .5s ease both",
                animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <span style={{ fontSize: 34 }}>{s.emoji}</span>
                  <span style={{
                    fontSize: 12, color: accent.value, fontFamily: G.sans,
                    fontWeight: 700, opacity: .7,
                  }}>{s.num}</span>
                </div>
                <h3 style={{ color: "#e8f5e8", fontSize: 17, fontWeight: 700, margin: "0 0 8px", fontFamily: G.sans }}>{s.title}</h3>
                <p style={{ color: "#5a7a5a", fontSize: 13, fontFamily: G.body, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ── Listings ──────────────────────────────────────── */}
      <section id="listings-sec" style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem 2rem" }}>
        <SectionLabel>{t("listings_label")}</SectionLabel>
        <h2 style={{
          fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 800, color: "#e8f5e8",
          marginBottom: "2rem", letterSpacing: "-1px", fontFamily: G.sans,
        }}>
          {t("listings_title")}
        </h2>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
          <input type="text" placeholder={t("search_placeholder")} value={search}
            onClick={() => { if (!user) showAuthModal(); }}
            onChange={e => { if (!user) showAuthModal(); else setSearch(e.target.value); }}
            style={{
              flex: "1 1 200px", minWidth: 160,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "11px 16px",
              color: "#e8f5e8", fontSize: 14, outline: "none",
              fontFamily: G.body, transition: "border-color .2s",
            }}
            onFocus={e => e.currentTarget.style.borderColor = accent.value}
            onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          />
          <select value={city}
            onClick={() => { if (!user) showAuthModal(); }}
            onChange={e => { if (!user) showAuthModal(); else setCity(e.target.value); }}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "11px 16px",
              color: "#e8f5e8", fontSize: 13, cursor: "pointer",
              fontFamily: G.body, outline: "none",
            }}>
            {cities.map(c => (
              <option key={c} value={c} style={{ background: "#0d1a0d" }}>
                {c === "All" ? t("all_locations") : c}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              border: `3px solid ${accent.value}30`,
              borderTopColor: accent.value,
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }} />
            <p style={{ color: "#3a5a3a", fontFamily: G.body }}>Loading meals from the database…</p>
          </div>
        )}

        {/* Error */}
        {!loading && apiError && (
          <div style={{
            background: "rgba(42,10,10,0.8)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(90,26,26,0.6)", borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem",
          }}>
            <p style={{ color: "#f87171", fontFamily: G.body, margin: 0 }}>⚠ {apiError}</p>
            <p style={{ color: "#3a5a3a", fontFamily: G.body, fontSize: 13, margin: "6px 0 0" }}>
              Make sure the backend is running on port 5000.
            </p>
          </div>
        )}

        {!loading && !apiError && (
          <>
            <p style={{ color: "#3a5a3a", fontSize: 13, fontFamily: G.body, marginBottom: "1.5rem" }}>
              {filtered.length} listing{filtered.length !== 1 ? "s" : ""} available
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
              {filtered.map((item, i) => (
                <Card3D key={item._id} style={{
                  padding: "1.5rem",
                  display: "flex", flexDirection: "column", gap: 14,
                  animation: "fadeUp .4s ease both",
                  animationDelay: `${i * 0.07}s`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#e8f5e8", fontFamily: G.sans }}>{item.title}</h3>
                      <p style={{ margin: "4px 0 0", fontSize: 13, color: "#3a5a3a", fontFamily: G.body }}>{item.description}</p>
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
                        <span style={{
                          fontSize: 13, fontFamily: G.body,
                          color: ico === "⏱" ? accent.value : "#5a7a5a",
                        }}>{txt}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleClaim(item._id)}
                    style={{
                      width: "100%", padding: 12, borderRadius: 10, border: "none",
                      background: claimed.includes(item._id)
                        ? `${accent.value}30`
                        : `linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
                      color: claimed.includes(item._id) ? accent.value : "#fff",
                      fontSize: 14, fontWeight: 600, cursor: "pointer",
                      fontFamily: G.sans, transition: "all .2s",
                      boxShadow: claimed.includes(item._id) ? "none" : `0 4px 16px ${accent.glow}`,
                    }}
                    onMouseEnter={e => { if (!claimed.includes(item._id)) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${accent.glow}`; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = claimed.includes(item._id) ? "none" : `0 4px 16px ${accent.glow}`; }}
                  >
                    {claimed.includes(item._id) ? t("claimed") : user ? t("claim_btn") : t("login_to_claim")}
                  </button>
                </Card3D>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#3a5a3a" }}>
                <p style={{ fontSize: 48, margin: "0 0 1rem" }}>🍽</p>
                <p style={{ fontSize: 17, fontWeight: 600, fontFamily: G.sans, color: "#5a7a5a" }}>No listings found</p>
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
      <section id="why-resqmeal" style={{
        padding: "5rem 2rem", marginTop: "3rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        background: "linear-gradient(180deg, rgba(13,26,13,0.3) 0%, rgba(6,10,6,0) 100%)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionLabel>{t("why_label")}</SectionLabel>
          <h2 style={{
            fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 800, color: "#e8f5e8",
            marginBottom: "2.5rem", letterSpacing: "-1px", fontFamily: G.sans,
          }}>
            {t("why_title")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            {[
              { emoji:"🆓", title:"Always Free",       desc:"No subscription, no hidden fees. Claiming food is free for everyone, forever." },
              { emoji:"⚡", title:"Real-Time Alerts",  desc:"Listings go live instantly. Get notified the moment food is available near you." },
              { emoji:"🥗", title:"Diet Filters",      desc:"Filter by Veg / Non-Veg. Every listing clearly marked for dietary needs." },
              { emoji:"📍", title:"Hyper Local",       desc:"See only listings within your radius. No irrelevant results from other cities." },
              { emoji:"🌱", title:"Zero Waste Impact", desc:"Every meal claimed removes food from landfill. Track your personal CO₂ saved." },
              { emoji:"🤝", title:"Community Driven",  desc:"Built by and for students, working professionals, and hostel managers alike." },
            ].map(f => (
              <Card3D key={f.title} style={{ padding: "1.4rem" }}>
                <span style={{ fontSize: 30, display: "block", marginBottom: 10 }}>{f.emoji}</span>
                <h4 style={{ color: "#e8f5e8", fontSize: 15, fontWeight: 700, margin: "0 0 6px", fontFamily: G.sans }}>{f.title}</h4>
                <p style={{ color: "#5a7a5a", fontSize: 13, fontFamily: G.body, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section id="stories" style={{ maxWidth: 1100, margin: "3rem auto 0", padding: "5rem 2rem" }}>
        <SectionLabel>{t("stories_label")}</SectionLabel>
        <h2 style={{
          fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 800, color: "#e8f5e8",
          marginBottom: "2.5rem", letterSpacing: "-1px", fontFamily: G.sans,
        }}>
          {t("stories_title")}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
          {[
            { name:"Riya Agarwal",        role:"Student, Delhi University",   quote:"I save ₹800/month just by using ResQMeal 3–4 times a week. Food is always fresh!", avatar:"RA" },
            { name:"Deepak — Hostel Mgr", role:"Sunrise Hostel, Delhi",       quote:"Listing leftover food takes 2 mins. Zero waste, good karma, super simple app.",    avatar:"DH" },
            { name:"Ananya Singh",         role:"Working Professional, Noida", quote:"Late office days sorted! I just check ResQMeal on the way home. Always something.", avatar:"AS" },
            { name:"Pradeep Kumar",        role:"PG Owner, Gurgaon",           quote:"Since joining ResQMeal our food wastage dropped by 90%. Highly recommend it!",     avatar:"PK" },
          ].map(t2 => (
            <Card3D key={t2.name} style={{ padding: "1.6rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <span style={{ color: accent.value, fontSize: 20, fontFamily: G.sans }}>❝</span>
                <p style={{ color: "#9ab39a", fontSize: 14, fontFamily: G.body, lineHeight: 1.8, margin: "4px 0 0", fontStyle: "italic" }}>
                  {t2.quote}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${accent.dark}40, ${accent.value}40)`,
                  border: `1px solid ${accent.value}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: accent.value, fontFamily: G.sans,
                }}>
                  {t2.avatar}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#e8f5e8", fontFamily: G.sans }}>{t2.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#3a5a3a", fontFamily: G.body }}>{t2.role}</p>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section id="cta" style={{ textAlign: "center", padding: "6rem 2rem", maxWidth: 700, margin: "0 auto" }}>
        <SectionLabel>{t("cta_label")}</SectionLabel>
        <h2 style={{
          fontSize: "clamp(1.8rem,4vw,3.2rem)", fontWeight: 900, color: "#e8f5e8",
          margin: "0 0 1.2rem", letterSpacing: "-1px", fontFamily: G.sans,
        }}>
          {t("cta_title")}{" "}
          <span style={{
            background: `linear-gradient(135deg, ${accent.value}, ${accent.dark})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 16px ${accent.glow})`,
          }}>{t("cta_green")}</span>
        </h2>
        <p style={{ color: "#5a7a5a", fontSize: 16, fontFamily: G.body, margin: "0 0 2.5rem", lineHeight: 1.7 }}>
          {t("cta_sub")}
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <GreenBtn onClick={() => user ? setPage("Dashboard") : showAuthModal()}>
            {user ? t("btn_dashboard") : t("btn_get_started")}
          </GreenBtn>
          <GreenBtn outline onClick={() => setPage("About")}>
            {t("btn_learn")}
          </GreenBtn>
        </div>
      </section>
    </div>
  );
}
