import { useState } from "react";
import { C, G, GreenBtn, Input, SectionLabel } from "../shared";
import { useAuth } from "../context/AuthContext";

export default function Register({ setPage }) {
  const { login } = useAuth();
  const [role,  setRole]  = useState("receiver");
  const [step,  setStep]  = useState(1);
  const [done,  setDone]  = useState(false);
  const [form,  setForm]  = useState({
    name:"", email:"", phone:"", password:"", confirmPass:"",
    pgName:"", city:"", address:"", diet:"Both", notifications: true,
  });
  const handleRegister = async () => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      login(data.token, data.user);  // store JWT + user globally
      setPage("Dashboard");          // redirect straight to Dashboard
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error. Is your backend running?");
  }
};

  const set  = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const CITIES = ["Noida", "Delhi", "Gurgaon", "Faridabad", "Ghaziabad"];

  const step1Valid = form.name && form.email && form.password && form.password === form.confirmPass;
  const step2Valid = role === "receiver" ? !!form.city : (!!form.pgName && !!form.city && !!form.address);

  const STEPS = role === "donor"
    ? ["Basic Info", "PG Details", "Review"]
    : ["Basic Info", "Preferences", "Review"];

  return (
    <div style={{ maxWidth: 560, margin: "3rem auto", padding: "0 2rem 5rem" }}>

      {/* ── Header ───────────────────────────────────────── */}
      <SectionLabel>CREATE ACCOUNT</SectionLabel>
      <h1 style={{
        fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: C.text,
        margin: "0 0 .6rem", letterSpacing: "-1px", fontFamily: G.sans,
      }}>
        Join <span style={{ color: C.green }}>ResQMeal</span>
      </h1>
      <p style={{ color: C.subtle, fontSize: 15, fontFamily: G.body, margin: "0 0 2.5rem" }}>
        Already have an account?{" "}
        <button onClick={() => setPage("Login")}
          style={{ background: "none", border: "none", color: C.green, cursor: "pointer", fontSize: 15, fontFamily: G.body }}>
          Sign in →
        </button>
      </p>

      {/* ── Success ──────────────────────────────────────── */}
      {done ? (
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
          padding: "3rem 2rem", textAlign: "center",
        }}>
          <span style={{ fontSize: 60, display: "block", marginBottom: "1.2rem" }}>🎉</span>
          <h2 style={{ color: C.green, fontFamily: G.sans, fontWeight: 800, fontSize: 26, margin: "0 0 .75rem" }}>
            You're in!
          </h2>
          <p style={{ color: C.subtle, fontFamily: G.body, fontSize: 15, lineHeight: 1.7, margin: "0 0 .5rem" }}>
            Welcome to ResQMeal, <strong style={{ color: C.text }}>{form.name.split(" ")[0] || "friend"}</strong>!
          </p>
          <p style={{ color: C.dim, fontFamily: G.body, fontSize: 14, margin: "0 0 2rem" }}>
            A confirmation has been sent to <strong style={{ color: C.muted }}>{form.email}</strong>
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <GreenBtn onClick={() => setPage("Home")}>Explore Listings →</GreenBtn>
            <GreenBtn outline onClick={() => setPage("Login")}>Sign In</GreenBtn>
          </div>
        </div>
      ) : (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "2rem" }}>

          {/* ── Role toggle ──────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "2rem" }}>
            {[["receiver", "🍽", "Claim Food"], ["donor", "🏠", "List Surplus"]].map(([r, ico, label]) => (
              <button key={r} onClick={() => { setRole(r); setStep(1); }}
                style={{
                  padding: "14px 10px", borderRadius: 12, cursor: "pointer",
                  border: `2px solid ${role === r ? C.green : C.border}`,
                  background: role === r ? "#0f2a0f" : "transparent",
                  color: role === r ? C.green : C.subtle,
                  fontSize: 14, fontFamily: G.sans, fontWeight: 600,
                  transition: "all .2s", textAlign: "center",
                }}>
                <span style={{ fontSize: 20, display: "block", marginBottom: 6 }}>{ico}</span>
                {label}
              </button>
            ))}
          </div>

          {/* ── Step progress ────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", gap: 0 }}>
            {STEPS.map((label, i) => {
              const s = i + 1;
              const active  = step === s;
              const done_s  = step > s;
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, fontFamily: G.sans,
                      background: done_s ? C.greenDark : active ? "#0f2a0f" : "#0a1a0a",
                      border: `2px solid ${done_s || active ? C.greenDark : C.border}`,
                      color: done_s ? "#fff" : active ? C.green : C.dim,
                    }}>
                      {done_s ? "✓" : s}
                    </div>
                    <span style={{ fontSize: 10, color: active ? C.green : C.dim, fontFamily: G.body, whiteSpace: "nowrap" }}>
                      {label}
                    </span>
                  </div>
                  {s < STEPS.length && (
                    <div style={{ flex: 1, height: 2, background: step > s ? C.greenDark : C.border, margin: "0 4px", marginBottom: 16 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Step 1: Basic Info ───────────────────────── */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Input label="Full Name"      placeholder="Rahul Sharma"         value={form.name}        onChange={set("name")}        required />
              <Input label="Email Address"  type="email" placeholder="you@email.com"          value={form.email}       onChange={set("email")}       required />
              <Input label="Phone Number"   type="tel"   placeholder="+91 98765 43210"        value={form.phone}       onChange={set("phone")}       required />
              <Input label="Password"       type="password" placeholder="Min 8 characters"    value={form.password}    onChange={set("password")}    required />
              <Input label="Confirm Password" type="password" placeholder="Re-enter password" value={form.confirmPass} onChange={set("confirmPass")} required />
              {form.password && form.confirmPass && form.password !== form.confirmPass && (
                <p style={{ color: "#ef4444", fontSize: 12, fontFamily: G.body, margin: 0 }}>Passwords do not match</p>
              )}

              {/* Password strength indicator */}
              {form.password && (
                <div>
                  <p style={{ fontSize: 12, color: C.dim, fontFamily: G.body, margin: "0 0 6px" }}>Password strength</p>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4].map(n => (
                      <div key={n} style={{
                        flex: 1, height: 4, borderRadius: 2,
                        background: form.password.length >= n * 3
                          ? (form.password.length >= 12 ? C.greenDark : form.password.length >= 8 ? "#f59e0b" : "#ef4444")
                          : C.border,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              <GreenBtn onClick={() => step1Valid && setStep(2)} style={{ marginTop: 8 }}>
                Continue →
              </GreenBtn>
            </div>
          )}

          {/* ── Step 2: Donor — PG Details ───────────────── */}
          {step === 2 && role === "donor" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Input label="PG / Hostel Name" placeholder="Green Valley PG"      value={form.pgName}  onChange={set("pgName")}  required />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>City <span style={{ color: "#ef4444" }}>*</span></label>
                <select value={form.city} onChange={set("city")}
                  style={{ background: "#0f1f0f", border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 14px", color: form.city ? C.text : "#3a5a3a", fontSize: 14, outline: "none", fontFamily: G.body }}>
                  <option value="">Select city…</option>
                  {CITIES.map(c => <option key={c} style={{ background: "#0d1f0d" }}>{c}</option>)}
                </select>
              </div>
              <Input label="Full Address"     placeholder="Sector 62, Noida"      value={form.address} onChange={set("address")} required />

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>Typical food type</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Veg", "Non-Veg", "Both"].map(d => (
                    <button key={d} onClick={() => setForm(p => ({ ...p, diet: d }))}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                        border: `1px solid ${form.diet === d ? C.green : C.border}`,
                        background: form.diet === d ? "#0f2a0f" : "transparent",
                        color: form.diet === d ? C.green : C.subtle,
                        fontSize: 13, fontFamily: G.body, transition: "all .2s",
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <GreenBtn outline onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</GreenBtn>
                <GreenBtn onClick={() => step2Valid && setStep(3)} style={{ flex: 1 }}>Continue →</GreenBtn>
              </div>
            </div>
          )}

          {/* ── Step 2: Receiver — Preferences ───────────── */}
          {step === 2 && role === "receiver" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>Preferred City <span style={{ color: "#ef4444" }}>*</span></label>
                <select value={form.city} onChange={set("city")}
                  style={{ background: "#0f1f0f", border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 14px", color: form.city ? C.text : "#3a5a3a", fontSize: 14, outline: "none", fontFamily: G.body }}>
                  <option value="">Select city…</option>
                  {CITIES.map(c => <option key={c} style={{ background: "#0d1f0d" }}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>Diet Preference</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Veg", "Non-Veg", "Both"].map(d => (
                    <button key={d} onClick={() => setForm(p => ({ ...p, diet: d }))}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                        border: `1px solid ${form.diet === d ? C.green : C.border}`,
                        background: form.diet === d ? "#0f2a0f" : "transparent",
                        color: form.diet === d ? C.green : C.subtle,
                        fontSize: 13, fontFamily: G.body, transition: "all .2s",
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0a1a0a", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, color: C.text, fontFamily: G.body }}>Push notifications</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.dim, fontFamily: G.body }}>Get alerted when food is available near you</p>
                </div>
                <button onClick={() => setForm(p => ({ ...p, notifications: !p.notifications }))}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: form.notifications ? C.greenDark : C.border,
                    position: "relative", transition: "background .2s", flexShrink: 0,
                  }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 3, transition: "left .2s",
                    left: form.notifications ? 23 : 3,
                  }} />
                </button>
              </div>

              <div style={{ background: "#0f2a0f", border: "1px solid #1a4a1a", borderRadius: 12, padding: "1rem" }}>
                <p style={{ color: C.green, fontSize: 13, fontFamily: G.body, margin: 0, lineHeight: 1.6 }}>
                  💚 By joining, you agree to our Community Guidelines — only claim what you'll eat and always show up on time!
                </p>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <GreenBtn outline onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</GreenBtn>
                <GreenBtn onClick={() => step2Valid && setStep(3)} style={{ flex: 1 }}>Continue →</GreenBtn>
              </div>
            </div>
          )}

          {/* ── Step 3: Review ───────────────────────────── */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h4 style={{ color: C.text, fontFamily: G.sans, fontWeight: 700, margin: 0, fontSize: 16 }}>Review your details</h4>
              <div style={{ background: "#0a1a0a", border: `1px solid ${C.border}`, borderRadius: 12, padding: "1rem" }}>
                {[
                  ["Name",        form.name],
                  ["Email",       form.email],
                  ["Phone",       form.phone || "—"],
                  ["Role",        role === "donor" ? "Donor (PG / Hostel)" : "Receiver"],
                  ["City",        form.city],
                  ...(role === "donor" ? [["PG Name", form.pgName], ["Address", form.address]] : []),
                  ["Diet pref",   form.diet],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>{k}</span>
                    <span style={{ fontSize: 13, color: C.text, fontFamily: G.body, maxWidth: "60%", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>

              <p style={{ color: C.dim, fontSize: 12, fontFamily: G.body, lineHeight: 1.6, margin: 0 }}>
                By creating an account you agree to our <u style={{ cursor: "pointer", color: C.muted }}>Terms of Service</u> and <u style={{ cursor: "pointer", color: C.muted }}>Privacy Policy</u>.
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <GreenBtn outline onClick={() => setStep(2)} style={{ flex: 1 }}>← Back</GreenBtn>
                <GreenBtn onClick={handleRegister} style={{ flex: 1 }}>Create Account 🎉</GreenBtn>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Trust row ────────────────────────────────────── */}
      {!done && (
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
          {["🔒 Secure signup", "🌱 Always free", "💚 No spam ever"].map(t => (
            <span key={t} style={{ fontSize: 12, color: C.dim, fontFamily: G.body }}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
