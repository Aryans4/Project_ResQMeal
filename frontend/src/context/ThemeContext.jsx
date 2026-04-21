import { createContext, useContext, useState, useEffect } from "react";

export const ACCENT_PRESETS = [
  { name: "Emerald",  value: "#10b981", dark: "#059669", glow: "rgba(16,185,129,0.35)",  label: "🟢" },
  { name: "Cyan",     value: "#06b6d4", dark: "#0891b2", glow: "rgba(6,182,212,0.35)",   label: "🔵" },
  { name: "Violet",   value: "#8b5cf6", dark: "#7c3aed", glow: "rgba(139,92,246,0.35)",  label: "🟣" },
  { name: "Orange",   value: "#f97316", dark: "#ea580c", glow: "rgba(249,115,22,0.35)",  label: "🟠" },
  { name: "Pink",     value: "#ec4899", dark: "#db2777", glow: "rgba(236,72,153,0.35)",  label: "🩷" },
  { name: "Gold",     value: "#eab308", dark: "#ca8a04", glow: "rgba(234,179,8,0.35)",   label: "🟡" },
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [accentIndex, setAccentIndex] = useState(() => {
    const saved = localStorage.getItem("resqmeal_accent");
    return saved ? parseInt(saved, 10) : 0;
  });

  const accent = ACCENT_PRESETS[accentIndex] || ACCENT_PRESETS[0];

  useEffect(() => {
    localStorage.setItem("resqmeal_accent", accentIndex);
    const root = document.documentElement;
    root.style.setProperty("--accent",      accent.value);
    root.style.setProperty("--accent-dark", accent.dark);
    root.style.setProperty("--accent-glow", accent.glow);
  }, [accentIndex, accent]);

  return (
    <ThemeContext.Provider value={{ accent, accentIndex, setAccentIndex, presets: ACCENT_PRESETS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
