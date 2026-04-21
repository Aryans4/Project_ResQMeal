import { C, G, GreenBtn, SectionLabel } from "../shared";

const TEAM = [
  { name:"Aryan Mehta",    role:"Co-Founder & CEO",       emoji:"👨‍💻", bio:"IIT Delhi grad passionate about zero-waste futures and sustainable cities." },
  { name:"Priya Sharma",   role:"Co-Founder & COO",       emoji:"👩‍🎨", bio:"Former NGO lead with 8 years in food distribution across North India." },
  { name:"Rahul Verma",    role:"Head of Engineering",    emoji:"🛠",  bio:"Built scalable systems at Zomato & Swiggy before joining the mission." },
  { name:"Sneha Gupta",    role:"Community Manager",      emoji:"💚",  bio:"Onboards & connects 200+ PGs across NCR every single day." },
  { name:"Karan Malhotra", role:"Product Designer",       emoji:"🎨",  bio:"Previously at Razorpay, obsessed with simple UX for real-world impact." },
  { name:"Divya Nair",     role:"Partnerships Lead",      emoji:"🤝",  bio:"Grew our NGO & hostel network from 10 to 340+ in under a year." },
];

const TIMELINE = [
  { year:"2023", title:"The Idea",         desc:"Founders noticed massive food waste in their Delhi PG and started a WhatsApp group." },
  { year:"2023", title:"First 10 PGs",     desc:"Manually coordinating 10 PGs in Noida. 200 meals rescued in the first month." },
  { year:"2024", title:"App Launch",       desc:"ResQMeal v1.0 goes live. 1,000 users in the first week. Delhi & Gurgaon added." },
  { year:"2024", title:"Series A",         desc:"Raised ₹2.5 Cr seed round. Expanded to 4 cities. 100,000 meals milestone hit." },
  { year:"2025", title:"Scale & Impact",   desc:"340+ PGs, 6,200+ users, 12,400+ meals rescued. 18 cities launching soon." },
];

export default function About({ setPage }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <SectionLabel>OUR STORY</SectionLabel>
      <h1 style={{
        fontSize: "clamp(2rem,4.5vw,3.5rem)", fontWeight: 800, color: C.text,
        margin: "0 0 1.5rem", letterSpacing: "-1px", fontFamily: G.sans,
      }}>
        We're fighting food waste,<br />
        <span style={{ color: C.green }}>one PG at a time.</span>
      </h1>
      <p style={{
        color: C.subtle, fontSize: 16, fontFamily: G.body, lineHeight: 1.8,
        maxWidth: 680, marginBottom: "3.5rem",
      }}>
        ResQMeal was born in 2023 when our founders, staying in a Delhi PG, noticed how much food went to waste every night while students nearby went hungry. What started as a WhatsApp group is now a platform connecting hundreds of PGs and thousands of beneficiaries across NCR.
      </p>

      {/* ── Mission / Vision / Values ────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginBottom: "4rem" }}>
        {[
          { emoji:"🎯", title:"Our Mission", text:"To eliminate food waste from PGs and hostels in India by making redistribution effortless, instant, and joyful." },
          { emoji:"🌱", title:"Our Vision",  text:"An India where no cooked meal goes to waste — where surplus flows instantly to those who need it most." },
          { emoji:"💚", title:"Our Values",  text:"Transparency. Community first. Zero friction. Every feature we build is guided by the people we serve." },
        ].map(c => (
          <div key={c.title} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "1.75rem",
            transition: "border-color .2s,transform .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHov; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;    e.currentTarget.style.transform = "translateY(0)"; }}>
            <span style={{ fontSize: 36, display: "block", marginBottom: "1rem" }}>{c.emoji}</span>
            <h3 style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: "0 0 10px", fontFamily: G.sans }}>{c.title}</h3>
            <p style={{ color: C.subtle, fontSize: 14, fontFamily: G.body, lineHeight: 1.7, margin: 0 }}>{c.text}</p>
          </div>
        ))}
      </div>

      {/* ── Impact Numbers ───────────────────────────────── */}
      <div style={{
        background: "#0d1f0d", border: `1px solid ${C.border}`, borderRadius: 20,
        padding: "2.5rem 2rem", marginBottom: "4rem",
      }}>
        <h2 style={{
          color: C.text, fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800,
          textAlign: "center", margin: "0 0 2rem", fontFamily: G.sans,
        }}>
          Our Impact in Numbers
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 24 }}>
          {[
            ["12,400+","Meals rescued"],
            ["340+","Partner PGs & Hostels"],
            ["6,200+","Registered users"],
            ["2.5T","CO₂ equivalent saved"],
            ["4","Cities active"],
            ["99%","Listings claimed in time"],
          ].map(([n, l]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 800, color: C.green, margin: 0, fontFamily: G.sans }}>{n}</p>
              <p style={{ fontSize: 12, color: C.dim, margin: "4px 0 0", fontFamily: G.body }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Timeline ─────────────────────────────────────── */}
      <SectionLabel>OUR JOURNEY</SectionLabel>
      <h2 style={{
        fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: C.text,
        margin: "0 0 2rem", letterSpacing: "-0.5px", fontFamily: G.sans,
      }}>
        From WhatsApp group to city-wide platform
      </h2>
      <div style={{ position: "relative", marginBottom: "4rem" }}>
        <div style={{
          position: "absolute", left: 18, top: 0, bottom: 0,
          width: 2, background: C.border,
        }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {TIMELINE.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 24, paddingLeft: 0 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                background: "#0f2a0f", border: `2px solid ${C.greenDark}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: C.green, fontFamily: G.sans, zIndex: 1,
              }}>
                {t.year.slice(2)}
              </div>
              <div style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: "1rem 1.25rem", flex: 1,
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: C.green, fontFamily: G.sans, fontWeight: 700 }}>{t.year}</span>
                  <h4 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0, fontFamily: G.sans }}>{t.title}</h4>
                </div>
                <p style={{ color: C.subtle, fontSize: 13, fontFamily: G.body, lineHeight: 1.65, margin: 0 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Team ─────────────────────────────────────────── */}
      <SectionLabel>THE TEAM</SectionLabel>
      <h2 style={{
        fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: C.text,
        margin: "0 0 2rem", letterSpacing: "-0.5px", fontFamily: G.sans,
      }}>
        People behind the mission
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20, marginBottom: "4rem" }}>
        {TEAM.map(m => (
          <div key={m.name} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "1.5rem", textAlign: "center",
            transition: "border-color .2s,transform .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHov; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;    e.currentTarget.style.transform = "translateY(0)"; }}>
            <span style={{ fontSize: 44, display: "block", marginBottom: "1rem" }}>{m.emoji}</span>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text, fontFamily: G.sans }}>{m.name}</p>
            <p style={{ margin: "4px 0 10px", fontSize: 13, color: C.green, fontFamily: G.body }}>{m.role}</p>
            <p style={{ margin: 0, fontSize: 13, color: C.dim, fontFamily: G.body, lineHeight: 1.6 }}>{m.bio}</p>
          </div>
        ))}
      </div>

      {/* ── Partners ─────────────────────────────────────── */}
      <div style={{
        background: "#0d1f0d", border: `1px solid ${C.border}`, borderRadius: 20,
        padding: "2.5rem 2rem", marginBottom: "4rem", textAlign: "center",
      }}>
        <p style={{ fontSize: 12, color: C.dim, fontFamily: G.body, letterSpacing: ".5px", marginBottom: "1.5rem" }}>BACKED & SUPPORTED BY</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1rem,4vw,3rem)", flexWrap: "wrap", alignItems: "center" }}>
          {["🏛 NASSCOM", "🌿 Social Alpha", "🎓 IIT Delhi Incubator", "💰 Blume Ventures", "🤝 UN Food Programme"].map(p => (
            <span key={p} style={{ fontSize: 14, color: C.muted, fontFamily: G.body }}>{p}</span>
          ))}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div style={{
        textAlign: "center", background: "#0d1f0d", border: `1px solid ${C.border}`,
        borderRadius: 20, padding: "3rem 2rem",
      }}>
        <h3 style={{ color: C.text, fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, margin: "0 0 1rem", fontFamily: G.sans }}>
          Want to join the movement?
        </h3>
        <p style={{ color: C.subtle, fontSize: 15, fontFamily: G.body, margin: "0 0 1.75rem" }}>
          Partner your PG, volunteer, or simply start claiming meals today.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <GreenBtn onClick={() => setPage("Register")}>Join ResQMeal →</GreenBtn>
          <GreenBtn outline onClick={() => setPage("Contact")}>Contact Us</GreenBtn>
        </div>
      </div>
    </div>
  );
}
