import { useState } from "react";
import { C, G, GreenBtn, SectionLabel } from "../shared";
import { useAuth } from "../context/AuthContext";

export default function DonateMeal({ setPage }) {
  const { user, authHeader } = useAuth();
  const [form, setForm] = useState({ title:"", description:"", location:"", quantity:"", expiryTime:"" });
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  if (!user) {
    return (
      <div style={{ minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
        {/* Blobs */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
          <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", top:"-10%", right:"-10%", filter:"blur(40px)", animation:"blob-float 20s ease-in-out infinite" }} />
          <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)", bottom:"0", left:"-10%", filter:"blur(40px)", animation:"blob-float 24s ease-in-out 4s infinite" }} />
        </div>
        <div style={{ position:"relative", zIndex:1, maxWidth:440, width:"100%", background:"rgba(255,255,255,0.75)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.5)", borderRadius:"1.5rem", padding:"3rem 2.5rem", textAlign:"center", boxShadow:"0 20px 60px rgba(45,212,191,0.15)" }}>
          <span style={{ fontSize:56, display:"block", marginBottom:"1.2rem" }}>🔒</span>
          <h2 style={{ color:C.text, fontFamily:G.sans, fontWeight:800, fontSize:22, margin:"0 0 .75rem", letterSpacing:"-0.5px" }}>Login Required</h2>
          <p style={{ color:C.muted, fontFamily:G.body, fontSize:14, margin:"0 0 2rem", lineHeight:1.6 }}>You need to be logged in to donate a meal to the community.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <GreenBtn onClick={() => setPage("Login")}>Login →</GreenBtn>
            <GreenBtn outline onClick={() => setPage("Register")}>Create Account</GreenBtn>
          </div>
        </div>
      </div>
    );
  }

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async () => {
    const { title, description, location, quantity, expiryTime } = form;
    if (!title || !description || !location || !quantity || !expiryTime) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    try {
      const res  = await fetch("/api/meals", { method:"POST", headers:{ "Content-Type":"application/json", ...authHeader() }, body:JSON.stringify({ title, description, location, quantity, expiryTime }) });
      let data;
      try { data = await res.json(); } catch { throw new Error("Backend not running."); }
      if (!res.ok) { setError(data.error || data.message || "Failed to post meal."); return; }
      setDone(true);
    } catch (e) { setError(e.message || "Could not reach server."); } finally { setLoading(false); }
  };

  const inputStyle = {
    background: "var(--input-bg)", border: "1.5px solid var(--border-sub)",
    borderRadius: "1rem", padding: "12px 16px", color: "var(--text)", fontSize: 14,
    outline: "none", fontFamily: G.body, width: "100%",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)", transition: "border-color .2s, box-shadow .2s",
  };
  const iFocus = e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 4px var(--accent-glow), inset 0 2px 6px rgba(0,0,0,0.05)"; };
  const iBlur  = e => { e.currentTarget.style.borderColor = "var(--border-sub)"; e.currentTarget.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.05)"; };

  if (done) {
    return (
      <div style={{ minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
        <div style={{ maxWidth:440, width:"100%", background:"rgba(255,255,255,0.75)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.5)", borderRadius:"1.5rem", padding:"3rem 2.5rem", textAlign:"center", boxShadow:"0 20px 60px rgba(45,212,191,0.15)" }}>
          <span style={{ fontSize:64, display:"block", marginBottom:"1.2rem" }}>🎉</span>
          <h2 style={{ color:C.pDark, fontFamily:G.sans, fontWeight:800, fontSize:26, margin:"0 0 .75rem", letterSpacing:"-0.5px" }}>Meal Listed!</h2>
          <p style={{ color:C.muted, fontFamily:G.body, fontSize:15, lineHeight:1.7, margin:"0 0 .5rem" }}>
            <strong style={{ color:C.text }}>{form.title}</strong> is now live and visible to the community.
          </p>
          <p style={{ color:C.subtle, fontFamily:G.body, fontSize:13, margin:"0 0 2rem" }}>You can track it in your Dashboard.</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <GreenBtn onClick={() => setPage("Dashboard")}>Go to Dashboard →</GreenBtn>
            <GreenBtn outline onClick={() => { setDone(false); setForm({ title:"", description:"", location:"", quantity:"", expiryTime:"" }); }}>List Another</GreenBtn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background:"#faf8ff", minHeight:"100vh", position:"relative" }}>
      {/* Background blobs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", top:"-5%", right:"-10%", filter:"blur(40px)", animation:"blob-float 20s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)", bottom:"0", left:"-5%", filter:"blur(40px)", animation:"blob-float 24s ease-in-out 5s infinite" }} />
      </div>

      <div style={{ position:"relative", zIndex:1, maxWidth:580, margin:"0 auto", padding:"3rem 1.5rem 6rem" }}>
        <SectionLabel>DONATE SURPLUS FOOD</SectionLabel>
        <h1 style={{ fontSize:"clamp(1.8rem,4vw,2.6rem)", fontWeight:900, color:C.text, margin:"0 0 .5rem", letterSpacing:"-0.04em", fontFamily:G.sans, lineHeight:1.1 }}>
          List a <span style={{ background:`linear-gradient(135deg, ${C.primary}, #1fc8b5)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Surplus Meal</span>
        </h1>
        <p style={{ color:C.muted, fontSize:15, fontFamily:G.body, margin:"0 0 2rem", lineHeight:1.6 }}>
          Fill in the details below. Your listing goes live instantly.
        </p>

        <div style={{ background:"rgba(255,255,255,0.75)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.5)", borderRadius:"1.5rem", padding:"2rem", boxShadow:"0 20px 60px rgba(45,212,191,0.12)" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:12, color:C.muted, fontFamily:G.label, letterSpacing:".08em", fontWeight:700, textTransform:"uppercase" }}>Meal Title <span style={{ color:"#ef4444" }}>*</span></label>
              <input placeholder="e.g. Dal Rice + Sabzi" value={form.title} onChange={set("title")} style={inputStyle} onFocus={iFocus} onBlur={iBlur} />
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:12, color:C.muted, fontFamily:G.label, letterSpacing:".08em", fontWeight:700, textTransform:"uppercase" }}>Description <span style={{ color:"#ef4444" }}>*</span></label>
              <textarea rows={3} placeholder="What's included? Any allergens? Freshly cooked?" value={form.description} onChange={e => setForm(p => ({ ...p, description:e.target.value }))}
                style={{ ...inputStyle, resize:"vertical", minHeight:90 }} onFocus={iFocus} onBlur={iBlur} />
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:12, color:C.muted, fontFamily:G.label, letterSpacing:".08em", fontWeight:700, textTransform:"uppercase" }}>Pickup Location <span style={{ color:"#ef4444" }}>*</span></label>
              <input placeholder="e.g. Green Valley PG, Sector 62, Noida" value={form.location} onChange={set("location")} style={inputStyle} onFocus={iFocus} onBlur={iBlur} />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label style={{ fontSize:12, color:C.muted, fontFamily:G.label, letterSpacing:".08em", fontWeight:700, textTransform:"uppercase" }}>Quantity <span style={{ color:"#ef4444" }}>*</span></label>
                <input placeholder="e.g. 4 servings" value={form.quantity} onChange={set("quantity")} style={inputStyle} onFocus={iFocus} onBlur={iBlur} />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label style={{ fontSize:12, color:C.muted, fontFamily:G.label, letterSpacing:".08em", fontWeight:700, textTransform:"uppercase" }}>Available Until <span style={{ color:"#ef4444" }}>*</span></label>
                <input type="datetime-local" value={form.expiryTime} onChange={set("expiryTime")} style={{ ...inputStyle, colorScheme:"light" }} onFocus={iFocus} onBlur={iBlur} />
              </div>
            </div>

            {/* Posting as */}
            <div style={{ background:"rgba(45,212,191,0.06)", border:"1.5px solid rgba(45,212,191,0.15)", borderRadius:"0.875rem", padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg, ${C.primary}, ${C.pDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", fontFamily:G.sans, flexShrink:0 }}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <p style={{ margin:0, fontSize:13, color:C.muted, fontFamily:G.body }}>
                Posting as <strong style={{ color:C.pDark }}>{user.name}</strong> · {user.email}
              </p>
            </div>

            {error && (
              <div style={{ background:"rgba(239,68,68,0.08)", border:"1.5px solid rgba(239,68,68,0.2)", borderRadius:"0.875rem", padding:"10px 14px" }}>
                <p style={{ color:"#dc2626", fontSize:13, fontFamily:G.body, margin:0 }}>⚠ {error}</p>
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              style={{ padding:"14px", borderRadius:"1rem", border:"none", background:`linear-gradient(135deg, ${C.primary}, #1fc8b5)`, color:"#fff", fontSize:15, fontWeight:700, cursor:loading ? "not-allowed" : "pointer", fontFamily:G.sans, boxShadow:"0 4px 20px rgba(45,212,191,0.35)", transition:"all .2s", opacity:loading ? .7 : 1 }}>
              {loading ? "Posting…" : "Post Meal Listing 🍱"}
            </button>
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginTop:"1.5rem", background:"rgba(45,212,191,0.07)", border:"1.5px solid rgba(45,212,191,0.2)", borderRadius:"1.25rem", padding:"1.25rem 1.5rem" }}>
          <p style={{ color:C.pDark, fontSize:13, fontFamily:G.sans, fontWeight:700, margin:"0 0 10px" }}>💡 Tips for a great listing</p>
          {["Be specific about the food — mention if it's freshly cooked","Set a realistic expiry time (within 2–3 hours is best)","Include clear pick-up instructions in the location field","Mark allergens if any (e.g. 'contains nuts')"].map((tip,i) => (
            <p key={i} style={{ color:C.muted, fontSize:13, fontFamily:G.body, margin:"5px 0", lineHeight:1.5 }}>• {tip}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
