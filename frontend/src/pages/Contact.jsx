import { useState } from "react";
import { C, G, GreenBtn, Input, SectionLabel } from "../shared";

const FAQS = [
  { q:"Is ResQMeal free to use?",           a:"Absolutely. Claiming surplus food is always free. PGs & hostels list their surplus at no cost whatsoever." },
  { q:"How do I list surplus food?",         a:"Register as a Donor, go to your dashboard and click 'Add Listing'. It takes under 2 minutes and listings go live instantly." },
  { q:"Are the meals safe to eat?",          a:"Yes. All listings must meet a 2-hour freshness window. Donors self-certify each listing and accounts with bad ratings are reviewed." },
  { q:"Which cities are supported?",         a:"Currently Delhi, Noida, Gurgaon, Faridabad & Ghaziabad. More cities launching soon — sign up to get notified!" },
  { q:"Can I volunteer with ResQMeal?",      a:"Yes! Email us at volunteer@resqmeal.in or fill the contact form below with 'Volunteer' as subject and we'll reach out." },
  { q:"How do I report a bad listing?",      a:"Use the 'Report' button on any listing card or email us at safety@resqmeal.in. We review all reports within 2 hours." },
  { q:"Is there a mobile app?",              a:"Our PWA works great on mobile — just open resqmeal.in on your phone and tap 'Add to Home Screen'. A native app is in beta." },
];

const OFFICES = [
  { emoji:"📧", title:"General Enquiries",  lines:["hello@resqmeal.in", "Replies within 24 hours"] },
  { emoji:"🤝", title:"Partnerships",       lines:["partner@resqmeal.in", "PG / hostel / NGO tie-ups"] },
  { emoji:"📍", title:"Office",             lines:["301, Startup Hub, Sector 62", "Noida, UP — 201301"] },
  { emoji:"📞", title:"Call / WhatsApp",    lines:["+91 98765 43210", "Mon–Fri, 9 AM – 7 PM IST"] },
  { emoji:"🐦", title:"Social Media",       lines:["@ResQMeal on Instagram", "@ResQMeal on X (Twitter)"] },
  { emoji:"🛡",  title:"Safety & Reports",  lines:["safety@resqmeal.in", "Urgent listings reviewed in 2 hrs"] },
];

export default function Contact() {
  const [form,     setForm]     = useState({ name:"", email:"", subject:"", message:"" });
  const [sent,     setSent]     = useState(false);
  const [faqOpen,  setFaqOpen]  = useState(null);
  const [category, setCategory] = useState("General");

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const handleSend = () => {
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>

      {/* ── Header ───────────────────────────────────────── */}
      <SectionLabel>GET IN TOUCH</SectionLabel>
      <h1 style={{
        fontSize: "clamp(2rem,4.5vw,3.2rem)", fontWeight: 800, color: C.text,
        margin: "0 0 1.2rem", letterSpacing: "-1px", fontFamily: G.sans,
      }}>
        We'd love to <span style={{ color: C.green }}>hear from you.</span>
      </h1>
      <p style={{
        color: C.subtle, fontSize: 16, fontFamily: G.body, margin: "0 0 3rem",
        lineHeight: 1.7, maxWidth: 560,
      }}>
        Questions, partnerships, press enquiries, volunteer interest — drop us a message and we'll reply within 24 hours.
      </p>

      {/* ── Contact info grid ────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16, marginBottom: "4rem" }}>
        {OFFICES.map(c => (
          <div key={c.title} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
            padding: "1.25rem 1.5rem", display: "flex", gap: 14, alignItems: "flex-start",
            transition: "border-color .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHov}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
            <span style={{ fontSize: 26 }}>{c.emoji}</span>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text, fontFamily: G.sans }}>{c.title}</p>
              {c.lines.map(l => (
                <p key={l} style={{ margin: "3px 0 0", fontSize: 13, color: C.muted, fontFamily: G.body }}>{l}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Form + Map ───────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 32, marginBottom: "4rem" }}>

        {/* Form */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "2rem" }}>
          <h3 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: "0 0 1.5rem", fontFamily: G.sans }}>
            Send a message
          </h3>

          {sent ? (
            <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
              <span style={{ fontSize: 52, display: "block", marginBottom: "1rem" }}>✅</span>
              <p style={{ color: C.green, fontSize: 18, fontWeight: 700, fontFamily: G.sans }}>Message sent!</p>
              <p style={{ color: C.subtle, fontSize: 14, fontFamily: G.body, marginTop: 8, lineHeight: 1.6 }}>
                We'll get back to you at <strong style={{ color: C.text }}>{form.email}</strong> within 24 hours.
              </p>
              <button onClick={() => { setSent(false); setForm({ name:"",email:"",subject:"",message:"" }); }}
                style={{
                  marginTop: "1.5rem", background: "none", border: `1px solid ${C.border}`,
                  color: C.muted, borderRadius: 8, padding: "8px 16px", cursor: "pointer",
                  fontSize: 13, fontFamily: G.body,
                }}>
                Send another message
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Category tabs */}
              <div>
                <label style={{ fontSize: 13, color: C.muted, fontFamily: G.body, display: "block", marginBottom: 8 }}>Category</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["General", "Partnership", "Volunteer", "Press", "Support"].map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      style={{
                        padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                        fontFamily: G.body, transition: "all .2s",
                        border: `1px solid ${category === cat ? C.green : C.border}`,
                        background: category === cat ? "#0f2a0f" : "transparent",
                        color: category === cat ? C.green : C.subtle,
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <Input label="Full Name"     placeholder="Rahul Sharma"          value={form.name}    onChange={set("name")}    required />
              <Input label="Email Address" type="email" placeholder="you@email.com"         value={form.email}   onChange={set("email")}   required />
              <Input label="Subject"       placeholder="How can we help you?"  value={form.subject} onChange={set("subject")} required />

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>
                  Message <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea rows={5} placeholder="Tell us more…" value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  style={{
                    background: "#0f1f0f", border: `1px solid ${C.border}`, borderRadius: 10,
                    padding: "11px 14px", color: C.text, fontSize: 14, outline: "none",
                    fontFamily: G.body, resize: "vertical", minHeight: 120,
                  }} />
              </div>
              <GreenBtn onClick={handleSend}>Send Message →</GreenBtn>
            </div>
          )}
        </div>

        {/* Map placeholder + quick links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
            overflow: "hidden", flex: 1, minHeight: 220,
            display: "flex", flexDirection: "column",
          }}>
            <div style={{
              flex: 1, background: "#0a1a0a", display: "flex", alignItems: "center",
              justifyContent: "center", flexDirection: "column", gap: 12, padding: "2rem",
              minHeight: 200,
            }}>
              <span style={{ fontSize: 48 }}>📍</span>
              <p style={{ color: C.muted, fontSize: 14, fontFamily: G.body, textAlign: "center", lineHeight: 1.6 }}>
                301, Startup Hub,<br />Sector 62, Noida — 201301
              </p>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer"
                style={{
                  color: C.green, fontSize: 13, fontFamily: G.body,
                  textDecoration: "none", borderBottom: `1px solid ${C.green}`,
                }}>
                Open in Google Maps →
              </a>
            </div>
          </div>

          {/* Response time card */}
          <div style={{
            background: "#0f2a0f", border: `1px solid #1a4a1a`, borderRadius: 14,
            padding: "1.25rem 1.5rem",
          }}>
            <p style={{ color: C.green, fontSize: 15, fontWeight: 700, margin: "0 0 10px", fontFamily: G.sans }}>
              ⚡ Response times
            </p>
            {[["General queries","Within 24 hours"],["Partnership requests","Within 48 hours"],["Safety reports","Within 2 hours"],["Press & media","Within 12 hours"]].map(([t, r]) => (
              <div key={t} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid #1a3a1a` }}>
                <span style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>{t}</span>
                <span style={{ fontSize: 13, color: C.text, fontFamily: G.body }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <SectionLabel>FAQ</SectionLabel>
      <h2 style={{
        fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, color: C.text,
        margin: "0 0 2rem", letterSpacing: "-0.5px", fontFamily: G.sans,
      }}>
        Frequently asked questions
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 800 }}>
        {FAQS.map((f, i) => (
          <div key={i} style={{
            background: C.card, border: `1px solid ${faqOpen === i ? C.borderHov : C.border}`,
            borderRadius: 14, overflow: "hidden", transition: "border-color .2s",
          }}>
            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              style={{
                width: "100%", padding: "1.1rem 1.4rem", background: "none", border: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer", gap: 12,
              }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: G.sans, textAlign: "left" }}>
                {f.q}
              </span>
              <span style={{ color: C.green, fontSize: 18, flexShrink: 0 }}>
                {faqOpen === i ? "−" : "+"}
              </span>
            </button>
            {faqOpen === i && (
              <div style={{ padding: "0 1.4rem 1.2rem" }}>
                <p style={{ color: C.subtle, fontSize: 14, fontFamily: G.body, lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Community CTA ────────────────────────────────── */}
      <div style={{
        marginTop: "4rem", background: "#0d1f0d", border: `1px solid ${C.border}`,
        borderRadius: 20, padding: "2.5rem 2rem", textAlign: "center",
      }}>
        <span style={{ fontSize: 42, display: "block", marginBottom: "1rem" }}>💚</span>
        <h3 style={{ color: C.text, fontSize: "clamp(1.3rem,3vw,1.8rem)", fontWeight: 800, margin: "0 0 .75rem", fontFamily: G.sans }}>
          Join our WhatsApp community
        </h3>
        <p style={{ color: C.subtle, fontSize: 14, fontFamily: G.body, margin: "0 0 1.5rem", lineHeight: 1.6 }}>
          Get real-time alerts, meet fellow food savers, and stay updated on new cities.
        </p>
        <GreenBtn>Join WhatsApp Group →</GreenBtn>
      </div>
    </div>
  );
}
