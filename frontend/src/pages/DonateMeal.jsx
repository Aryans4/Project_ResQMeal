import { useState } from "react";
import { C, G, GreenBtn, Input, SectionLabel } from "../shared";
import { useAuth } from "../context/AuthContext";

export default function DonateMeal({ setPage }) {
  const { user, authHeader } = useAuth();
  const [form, setForm] = useState({
    title: "", description: "", location: "", quantity: "", expiryTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  // Redirect if not logged in
  if (!user) {
    return (
      <div style={{ maxWidth: 480, margin: "5rem auto", padding: "0 2rem", textAlign: "center" }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "3rem 2rem" }}>
          <span style={{ fontSize: 52, display: "block", marginBottom: "1rem" }}>🔒</span>
          <h2 style={{ color: C.text, fontFamily: G.sans, fontWeight: 800, fontSize: 22, margin: "0 0 .75rem" }}>
            Login required
          </h2>
          <p style={{ color: C.subtle, fontFamily: G.body, fontSize: 14, margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            You need to be logged in to donate a meal to the community.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
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
    if (!title || !description || !location || !quantity || !expiryTime) {
      setError("Please fill in all fields."); return;
    }
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ title, description, location, quantity, expiryTime }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || data.message || "Failed to post meal."); return; }
      setDone(true);
    } catch {
      setError("Could not reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ maxWidth: 480, margin: "5rem auto", padding: "0 2rem 5rem" }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "3rem 2rem", textAlign: "center" }}>
          <span style={{ fontSize: 64, display: "block", marginBottom: "1.2rem" }}>🎉</span>
          <h2 style={{ color: C.green, fontFamily: G.sans, fontWeight: 800, fontSize: 26, margin: "0 0 .75rem" }}>
            Meal listed!
          </h2>
          <p style={{ color: C.subtle, fontFamily: G.body, fontSize: 15, lineHeight: 1.7, margin: "0 0 .5rem" }}>
            <strong style={{ color: C.text }}>{form.title}</strong> is now live and visible to the community.
          </p>
          <p style={{ color: C.dim, fontFamily: G.body, fontSize: 13, margin: "0 0 2rem" }}>
            You can track it in your Dashboard.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <GreenBtn onClick={() => setPage("Dashboard")}>Go to Dashboard →</GreenBtn>
            <GreenBtn outline onClick={() => { setDone(false); setForm({ title:"", description:"", location:"", quantity:"", expiryTime:"" }); }}>
              List Another
            </GreenBtn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "3rem auto", padding: "0 2rem 5rem" }}>
      <SectionLabel>DONATE SURPLUS FOOD</SectionLabel>
      <h1 style={{
        fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: C.text,
        margin: "0 0 .6rem", letterSpacing: "-1px", fontFamily: G.sans,
      }}>
        List a <span style={{ color: C.green }}>Surplus Meal</span>
      </h1>
      <p style={{ color: C.subtle, fontSize: 15, fontFamily: G.body, margin: "0 0 2.5rem", lineHeight: 1.6 }}>
        Fill in the details below. Your listing goes live instantly and the community will be able to claim it.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          <Input label="Meal Title" placeholder="e.g. Dal Rice + Sabzi"
            value={form.title} onChange={set("title")} required />

          {/* Description textarea */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>
              Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea rows={3} placeholder="What's included? Any allergens? Freshly cooked?"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              style={{
                background: "#0f1f0f", border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "11px 14px", color: C.text, fontSize: 14, outline: "none",
                fontFamily: G.body, resize: "vertical", minHeight: 90,
              }} />
          </div>

          <Input label="Pickup Location" placeholder="e.g. Green Valley PG, Sector 62, Noida"
            value={form.location} onChange={set("location")} required />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Input label="Quantity / Servings" placeholder="e.g. 4 servings"
              value={form.quantity} onChange={set("quantity")} required />

            {/* Expiry time */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: C.muted, fontFamily: G.body }}>
                Available Until <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input type="datetime-local" value={form.expiryTime}
                onChange={set("expiryTime")}
                style={{
                  background: "#0f1f0f", border: `1px solid ${C.border}`, borderRadius: 10,
                  padding: "11px 14px", color: C.text, fontSize: 14, outline: "none",
                  fontFamily: G.body, width: "100%", colorScheme: "dark",
                }} />
            </div>
          </div>

          {/* Posting as */}
          <div style={{ background: "#0a1a0a", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.muted, fontFamily: G.body }}>
              Posting as <strong style={{ color: C.text }}>{user.name}</strong> · {user.email}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "#2a0a0a", border: "1px solid #4a1a1a", borderRadius: 10, padding: "10px 14px" }}>
              <p style={{ color: "#f87171", fontSize: 13, fontFamily: G.body, margin: 0 }}>⚠ {error}</p>
            </div>
          )}

          <GreenBtn onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: 14 }}>
            {loading ? "Posting…" : "Post Meal Listing 🍱"}
          </GreenBtn>
        </div>
      </div>

      {/* Tips */}
      <div style={{ marginTop: "1.5rem", background: "#0f2a0f", border: "1px solid #1a4a1a", borderRadius: 14, padding: "1.25rem 1.5rem" }}>
        <p style={{ color: C.green, fontSize: 13, fontFamily: G.sans, fontWeight: 700, margin: "0 0 8px" }}>💡 Tips for a great listing</p>
        {[
          "Be specific about the food — mention if it's freshly cooked",
          "Set a realistic expiry time (within 2–3 hours is best)",
          "Include clear pick-up instructions in the location field",
          "Mark allergens if any (e.g. 'contains nuts')",
        ].map((t, i) => (
          <p key={i} style={{ color: C.subtle, fontSize: 12, fontFamily: G.body, margin: "4px 0", lineHeight: 1.5 }}>• {t}</p>
        ))}
      </div>
    </div>
  );
}
