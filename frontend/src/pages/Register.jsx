import { useState } from "react";
import { G, GreenBtn, Input, SectionLabel } from "../shared";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";
import CountryCodePicker from "../components/CountryCodePicker";
import LocationPopup    from "../components/LocationPopup";
import INDIAN_CITIES, { getStateForCity } from "../data/indianCities";

export default function Register({ setPage }) {
  const { login } = useAuth();
  const { t } = useLang();
  const { accent } = useTheme();

  const [role, setRole] = useState("receiver");
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [showLocPopup, setShowLocPopup] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDrop, setShowCityDrop] = useState(false);

  const [form, setForm] = useState({
    name:"", email:"", phone:"", countryCode:"+91",
    password:"", confirmPass:"",
    pgName:"", city:"", state:"", address:"", diet:"Both", notifications:true,
  });

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleCitySelect = (cityObj) => {
    setForm(p => ({ ...p, city: cityObj.city, state: cityObj.state }));
    setCitySearch(cityObj.city);
    setShowCityDrop(false);
  };

  const filteredCities = INDIAN_CITIES.filter(c =>
    c.city.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 40);

  const handleLocationFill = ({ address, city, state }) => {
    setForm(p => ({ ...p, address, city: city || p.city, state: state || p.state }));
    if (city) setCitySearch(city);
    setShowLocPopup(false);
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, password: form.password,
          role, phone: form.phone, countryCode: form.countryCode,
          city: form.city, state: form.state, pgName: form.pgName,
          address: form.address, diet: form.diet, notifications: form.notifications,
        }),
      });
      const data = await res.json();
      if (res.ok) { login(data.token, data.user); setPage("Home"); }
      else alert(data.message || "Registration failed");
    } catch { alert("Server error. Is your backend running?"); }
  };

  const step1Valid = form.name && form.email && form.password && form.password === form.confirmPass;
  const step2Valid = role === "receiver" ? !!form.city : (!!form.pgName && !!form.city && !!form.address);
  const STEPS = role === "donor"
    ? [t("step1"), t("step2_donor"), t("step3")]
    : [t("step1"), t("step2_recv"), t("step3")];

  const cardStyle = {
    background: "rgba(13,26,13,0.7)", backdropFilter: "blur(24px)",
    border: `1px solid ${accent.value}30`, borderRadius: 24, padding: "2rem",
    boxShadow: `0 0 60px ${accent.glow}20, 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)`,
  };

  const selectStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "12px 16px",
    color: "#e8f5e8", fontSize: 14, outline: "none",
    fontFamily: G.body, width: "100%", transition: "border-color .2s",
  };

  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
      {/* Orb */}
      <div style={{
        position:"fixed", top:"30%", left:"5%", width:300, height:300, borderRadius:"50%",
        background:`radial-gradient(circle, ${accent.value}10 0%, transparent 70%)`,
        animation:"orb-float 22s ease-in-out infinite", pointerEvents:"none", zIndex:0,
      }} />

      <div style={{ width:"100%", maxWidth:560, position:"relative", zIndex:1 }}>

        {/* Header */}
        <div style={{ marginBottom:"2rem", textAlign:"center" }}>
          <div style={{
            width:52, height:52, borderRadius:"50%",
            background:`linear-gradient(135deg, ${accent.dark}, ${accent.value})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:22, margin:"0 auto 1rem",
            boxShadow:`0 0 28px ${accent.glow}`,
          }}>🍱</div>
          <SectionLabel>{t("register_label")}</SectionLabel>
          <h1 style={{ fontSize:"clamp(1.8rem,4vw,2.6rem)", fontWeight:800, color:"#e8f5e8", margin:".5rem 0 .4rem", letterSpacing:"-1px", fontFamily:G.sans }}>
            {t("register_title")}{" "}
            <span style={{ background:`linear-gradient(135deg, ${accent.value}, ${accent.dark})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              ResQMeal
            </span>
          </h1>
          <p style={{ color:"#5a7a5a", fontSize:14, fontFamily:G.body, margin:0 }}>
            {t("register_sub")}{" "}
            <button onClick={() => setPage("Login")} style={{ background:"none", border:"none", color:accent.value, cursor:"pointer", fontSize:14, fontFamily:G.body }}>
              {t("register_signin")}
            </button>
          </p>
        </div>

        {/* Success */}
        {done ? (
          <div style={{ ...cardStyle, textAlign:"center", padding:"3rem 2rem" }}>
            <span style={{ fontSize:60, display:"block", marginBottom:"1.2rem" }}>🎉</span>
            <h2 style={{ color:accent.value, fontFamily:G.sans, fontWeight:800, fontSize:26, margin:"0 0 .75rem" }}>You're in!</h2>
            <p style={{ color:"#5a7a5a", fontFamily:G.body, fontSize:15, lineHeight:1.7, margin:"0 0 .5rem" }}>
              Welcome, <strong style={{ color:"#e8f5e8" }}>{form.name.split(" ")[0]}</strong>!
            </p>
            <p style={{ color:"#3a5a3a", fontFamily:G.body, fontSize:14, margin:"0 0 2rem" }}>
              Confirmation sent to <strong style={{ color:"#7a9a7a" }}>{form.email}</strong>
            </p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <GreenBtn onClick={() => setPage("Home")}>Explore Listings →</GreenBtn>
              <GreenBtn outline onClick={() => setPage("Login")}>Sign In</GreenBtn>
            </div>
          </div>
        ) : (
          <div style={cardStyle}>

            {/* Role toggle */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:"2rem" }}>
              {[["receiver","🍽","Claim Food"],["donor","🏠","List Surplus"]].map(([r,ico,label]) => (
                <button key={r} onClick={() => { setRole(r); setStep(1); }}
                  style={{
                    padding:"14px 10px", borderRadius:14, cursor:"pointer",
                    border:`2px solid ${role===r ? accent.value : "rgba(255,255,255,0.08)"}`,
                    background: role===r ? `${accent.value}15` : "rgba(255,255,255,0.03)",
                    color: role===r ? accent.value : "#5a7a5a",
                    fontSize:14, fontFamily:G.sans, fontWeight:600,
                    transition:"all .2s", textAlign:"center",
                    boxShadow: role===r ? `0 0 20px ${accent.glow}` : "none",
                  }}>
                  <span style={{ fontSize:22, display:"block", marginBottom:6 }}>{ico}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Step progress */}
            <div style={{ display:"flex", alignItems:"center", marginBottom:"2rem" }}>
              {STEPS.map((label, i) => {
                const s = i+1; const active = step===s; const done_s = step>s;
                return (
                  <div key={s} style={{ display:"flex", alignItems:"center", flex:1 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <div style={{
                        width:32, height:32, borderRadius:"50%",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:13, fontWeight:700, fontFamily:G.sans,
                        background: done_s ? accent.dark : active ? `${accent.value}20` : "rgba(255,255,255,0.04)",
                        border:`2px solid ${done_s||active ? accent.value : "rgba(255,255,255,0.1)"}`,
                        color: done_s ? "#fff" : active ? accent.value : "#3a5a3a",
                        boxShadow: active ? `0 0 12px ${accent.glow}` : "none",
                        transition:"all .3s",
                      }}>
                        {done_s ? "✓" : s}
                      </div>
                      <span style={{ fontSize:10, color:active ? accent.value : "#3a5a3a", fontFamily:G.body, whiteSpace:"nowrap" }}>
                        {label}
                      </span>
                    </div>
                    {s < STEPS.length && (
                      <div style={{ flex:1, height:2, background:step>s ? accent.dark : "rgba(255,255,255,0.07)", margin:"0 4px", marginBottom:16, transition:"background .3s" }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Step 1: Basic Info ── */}
            {step === 1 && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <Input label="Full Name" placeholder="Rahul Sharma" value={form.name} onChange={set("name")} required />
                <Input label="Email Address" type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} required />

                {/* Country Code + Phone */}
                <CountryCodePicker
                  value={form.countryCode}
                  phone={form.phone}
                  onCodeChange={v => setForm(p => ({ ...p, countryCode: v }))}
                  onPhoneChange={v => setForm(p => ({ ...p, phone: v }))}
                />

                <Input label="Password" type="password" placeholder="Min 8 characters" value={form.password} onChange={set("password")} required />
                <Input label="Confirm Password" type="password" placeholder="Re-enter password" value={form.confirmPass} onChange={set("confirmPass")} required />
                {form.password && form.confirmPass && form.password !== form.confirmPass && (
                  <p style={{ color:"#ef4444", fontSize:12, fontFamily:G.body, margin:0 }}>Passwords do not match</p>
                )}
                {form.password && (
                  <div>
                    <p style={{ fontSize:12, color:"#5a7a5a", fontFamily:G.body, margin:"0 0 6px" }}>Password strength</p>
                    <div style={{ display:"flex", gap:4 }}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{
                          flex:1, height:4, borderRadius:2,
                          background: form.password.length >= n*3
                            ? (form.password.length >= 12 ? accent.value : form.password.length >= 8 ? "#f59e0b" : "#ef4444")
                            : "rgba(255,255,255,0.08)",
                          transition:"background .3s",
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <GreenBtn onClick={() => step1Valid && setStep(2)} style={{ marginTop:8, width:"100%", borderRadius:12, padding:"13px" }}>
                  Continue →
                </GreenBtn>
              </div>
            )}

            {/* ── Step 2: Donor — PG Details ── */}
            {step === 2 && role === "donor" && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <Input label={t("pg_name")} placeholder="Green Valley PG" value={form.pgName} onChange={set("pgName")} required />

                {/* Searchable City Dropdown */}
                <div style={{ display:"flex", flexDirection:"column", gap:6, position:"relative" }}>
                  <label style={{ fontSize:12, color:"#7a9a7a", fontFamily:G.body, letterSpacing:".5px" }}>
                    {t("city_label")} <span style={{ color:"#ef4444" }}>*</span>
                  </label>
                  <input
                    placeholder={t("city_placeholder")}
                    value={citySearch}
                    onChange={e => { setCitySearch(e.target.value); setShowCityDrop(true); }}
                    onFocus={() => setShowCityDrop(true)}
                    style={{ ...selectStyle }}
                  />
                  {showCityDrop && filteredCities.length > 0 && (
                    <div style={{
                      position:"absolute", top:"100%", left:0, right:0, zIndex:500,
                      background:"#0d1a0d", border:`1px solid ${accent.value}30`,
                      borderRadius:12, maxHeight:220, overflowY:"auto",
                      boxShadow:`0 20px 60px rgba(0,0,0,0.8)`,
                    }}>
                      {filteredCities.map(c => (
                        <button key={c.city} onClick={() => handleCitySelect(c)}
                          style={{
                            width:"100%", padding:"9px 14px", background:"transparent",
                            border:"none", cursor:"pointer", textAlign:"left",
                            display:"flex", justifyContent:"space-between",
                            color:"#9ab39a", fontSize:13, fontFamily:G.body,
                            transition:"background .15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = `${accent.value}15`}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <span>{c.city}</span>
                          <span style={{ opacity:.5, fontSize:11 }}>{c.state}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {showCityDrop && <div style={{ position:"fixed", inset:0, zIndex:499 }} onClick={() => setShowCityDrop(false)} />}
                </div>

                {/* State (auto-filled) */}
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <label style={{ fontSize:12, color:"#7a9a7a", fontFamily:G.body, letterSpacing:".5px" }}>{t("state_label")}</label>
                  <input value={form.state} onChange={set("state")} placeholder="Auto-filled from city"
                    style={{ ...selectStyle, color: form.state ? "#e8f5e8" : "#3a5a3a" }}
                    onFocus={e => e.currentTarget.style.borderColor = accent.value}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>

                {/* Address with Location Popup */}
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <label style={{ fontSize:12, color:"#7a9a7a", fontFamily:G.body, letterSpacing:".5px" }}>
                    {t("full_address")} <span style={{ color:"#ef4444" }}>*</span>
                  </label>
                  <div style={{ position:"relative" }}>
                    <input
                      placeholder="Click to auto-fill or type manually"
                      value={form.address}
                      onChange={set("address")}
                      onClick={() => !form.address && setShowLocPopup(true)}
                      style={{ ...selectStyle, paddingRight:40 }}
                      onFocus={e => e.currentTarget.style.borderColor = accent.value}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                    <button onClick={() => setShowLocPopup(true)}
                      title="Auto-fill location"
                      style={{
                        position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
                        background:"none", border:"none", cursor:"pointer", fontSize:18,
                      }}>📍</button>
                  </div>
                  <p style={{ fontSize:11, color:"#3a5a3a", fontFamily:G.body, margin:0 }}>
                    💡 Click the 📍 icon or the field to auto-fill your current location
                  </p>
                </div>

                {/* Diet */}
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <label style={{ fontSize:12, color:"#7a9a7a", fontFamily:G.body, letterSpacing:".5px" }}>{t("diet_label")}</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {["Veg","Non-Veg","Both"].map(d => (
                      <button key={d} onClick={() => setForm(p => ({ ...p, diet:d }))}
                        style={{
                          flex:1, padding:"10px", borderRadius:10, cursor:"pointer",
                          border:`1px solid ${form.diet===d ? accent.value : "rgba(255,255,255,0.08)"}`,
                          background: form.diet===d ? `${accent.value}15` : "rgba(255,255,255,0.03)",
                          color: form.diet===d ? accent.value : "#5a7a5a",
                          fontSize:13, fontFamily:G.body, transition:"all .2s",
                          boxShadow: form.diet===d ? `0 0 12px ${accent.glow}` : "none",
                        }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display:"flex", gap:10, marginTop:8 }}>
                  <GreenBtn outline onClick={() => setStep(1)} style={{ flex:1, borderRadius:12 }}>← Back</GreenBtn>
                  <GreenBtn onClick={() => step2Valid && setStep(3)} style={{ flex:1, borderRadius:12 }}>Continue →</GreenBtn>
                </div>
              </div>
            )}

            {/* ── Step 2: Receiver Preferences ── */}
            {step === 2 && role === "receiver" && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

                {/* Searchable City */}
                <div style={{ display:"flex", flexDirection:"column", gap:6, position:"relative" }}>
                  <label style={{ fontSize:12, color:"#7a9a7a", fontFamily:G.body, letterSpacing:".5px" }}>
                    Preferred City <span style={{ color:"#ef4444" }}>*</span>
                  </label>
                  <input
                    placeholder={t("city_placeholder")}
                    value={citySearch}
                    onChange={e => { setCitySearch(e.target.value); setShowCityDrop(true); }}
                    onFocus={() => setShowCityDrop(true)}
                    style={{ ...selectStyle }}
                  />
                  {showCityDrop && filteredCities.length > 0 && (
                    <div style={{
                      position:"absolute", top:"100%", left:0, right:0, zIndex:500,
                      background:"#0d1a0d", border:`1px solid ${accent.value}30`,
                      borderRadius:12, maxHeight:220, overflowY:"auto",
                      boxShadow:`0 20px 60px rgba(0,0,0,0.8)`,
                    }}>
                      {filteredCities.map(c => (
                        <button key={c.city} onClick={() => handleCitySelect(c)}
                          style={{
                            width:"100%", padding:"9px 14px", background:"transparent",
                            border:"none", cursor:"pointer", textAlign:"left",
                            display:"flex", justifyContent:"space-between",
                            color:"#9ab39a", fontSize:13, fontFamily:G.body,
                            transition:"background .15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = `${accent.value}15`}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <span>{c.city}</span>
                          <span style={{ opacity:.5, fontSize:11 }}>{c.state}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {showCityDrop && <div style={{ position:"fixed", inset:0, zIndex:499 }} onClick={() => setShowCityDrop(false)} />}
                </div>

                {/* Diet */}
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <label style={{ fontSize:12, color:"#7a9a7a", fontFamily:G.body, letterSpacing:".5px" }}>Diet Preference</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {["Veg","Non-Veg","Both"].map(d => (
                      <button key={d} onClick={() => setForm(p => ({ ...p, diet:d }))}
                        style={{
                          flex:1, padding:"10px", borderRadius:10, cursor:"pointer",
                          border:`1px solid ${form.diet===d ? accent.value : "rgba(255,255,255,0.08)"}`,
                          background: form.diet===d ? `${accent.value}15` : "rgba(255,255,255,0.03)",
                          color: form.diet===d ? accent.value : "#5a7a5a",
                          fontSize:13, fontFamily:G.body, transition:"all .2s",
                        }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications toggle */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 16px" }}>
                  <div>
                    <p style={{ margin:0, fontSize:14, color:"#e8f5e8", fontFamily:G.body }}>Push notifications</p>
                    <p style={{ margin:0, fontSize:12, color:"#3a5a3a", fontFamily:G.body }}>Get alerted when food is available near you</p>
                  </div>
                  <button onClick={() => setForm(p => ({ ...p, notifications:!p.notifications }))}
                    style={{
                      width:44, height:24, borderRadius:12, border:"none", cursor:"pointer",
                      background: form.notifications ? accent.dark : "rgba(255,255,255,0.1)",
                      position:"relative", transition:"background .2s", flexShrink:0,
                      boxShadow: form.notifications ? `0 0 10px ${accent.glow}` : "none",
                    }}>
                    <div style={{
                      width:18, height:18, borderRadius:"50%", background:"#fff",
                      position:"absolute", top:3, transition:"left .2s",
                      left: form.notifications ? 23 : 3,
                      boxShadow:"0 1px 4px rgba(0,0,0,0.4)",
                    }} />
                  </button>
                </div>

                <div style={{ background:`${accent.value}10`, border:`1px solid ${accent.value}30`, borderRadius:12, padding:"1rem" }}>
                  <p style={{ color:accent.value, fontSize:13, fontFamily:G.body, margin:0, lineHeight:1.6 }}>
                    💚 By joining, you agree to our Community Guidelines — only claim what you'll eat and always show up on time!
                  </p>
                </div>

                <div style={{ display:"flex", gap:10, marginTop:8 }}>
                  <GreenBtn outline onClick={() => setStep(1)} style={{ flex:1, borderRadius:12 }}>← Back</GreenBtn>
                  <GreenBtn onClick={() => step2Valid && setStep(3)} style={{ flex:1, borderRadius:12 }}>Continue →</GreenBtn>
                </div>
              </div>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <h4 style={{ color:"#e8f5e8", fontFamily:G.sans, fontWeight:700, margin:0, fontSize:16 }}>Review your details</h4>
                <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"1rem" }}>
                  {[
                    ["Name",    form.name],
                    ["Email",   form.email],
                    ["Phone",   form.countryCode + " " + (form.phone || "—")],
                    ["Role",    role === "donor" ? "Donor (PG / Hostel)" : "Receiver"],
                    ["City",    form.city],
                    ["State",   form.state || "—"],
                    ...(role === "donor" ? [["PG Name", form.pgName], ["Address", form.address]] : []),
                    ["Diet",    form.diet],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize:13, color:"#5a7a5a", fontFamily:G.body }}>{k}</span>
                      <span style={{ fontSize:13, color:"#e8f5e8", fontFamily:G.body, maxWidth:"60%", textAlign:"right" }}>{v}</span>
                    </div>
                  ))}
                </div>

                <p style={{ color:"#3a5a3a", fontSize:12, fontFamily:G.body, lineHeight:1.6, margin:0 }}>
                  By creating an account you agree to our <u style={{ cursor:"pointer", color:"#5a7a5a" }}>Terms of Service</u> and <u style={{ cursor:"pointer", color:"#5a7a5a" }}>Privacy Policy</u>.
                </p>

                <div style={{ display:"flex", gap:10 }}>
                  <GreenBtn outline onClick={() => setStep(2)} style={{ flex:1, borderRadius:12 }}>← Back</GreenBtn>
                  <GreenBtn onClick={handleRegister} style={{ flex:1, borderRadius:12 }}>{t("create_account")}</GreenBtn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trust row */}
        {!done && (
          <div style={{ display:"flex", justifyContent:"center", gap:"1.5rem", marginTop:"1.5rem", flexWrap:"wrap" }}>
            {["🔒 Secure signup","🌱 Always free","💚 No spam ever"].map(tx => (
              <span key={tx} style={{ fontSize:12, color:"#3a5a3a", fontFamily:G.body }}>{tx}</span>
            ))}
          </div>
        )}
      </div>

      {/* Location Popup */}
      {showLocPopup && (
        <LocationPopup
          onAutoFill={handleLocationFill}
          onManual={() => setShowLocPopup(false)}
          onClose={() => setShowLocPopup(false)}
        />
      )}
    </div>
  );
}
