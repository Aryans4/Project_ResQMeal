import { useState } from "react";
import { Navbar, Footer, GlobalStyles } from "./shared";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home       from "./pages/Home";
import About      from "./pages/About";
import Contact    from "./pages/Contact";
import Register   from "./pages/Register";
import Login      from "./pages/Login";
import Dashboard  from "./pages/Dashboard";
import DonateMeal from "./pages/DonateMeal";

const PAGES = { Home, About, Contact, Register, Login, Dashboard, DonateMeal };

function AppInner() {
  const [page, setPage] = useState("Home");
  const { user, logout } = useAuth();

  const navigate = (p) => setPage(p);

  // Guard protected pages
  const requestPage = (p) => {
    if ((p === "Dashboard" || p === "DonateMeal") && !user) {
      setPage("Login");
    } else {
      setPage(p);
    }
  };

  const Page = PAGES[page] || Home;
  const showFooter = ["Home", "About"].includes(page);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0a", color: "#e8f5e8" }}>
      <GlobalStyles />
      <Navbar page={page} setPage={requestPage} user={user} logout={() => { logout(); setPage("Home"); }} />
      <main key={page} style={{ animation: "fadeUp .35s ease" }}>
        <Page setPage={requestPage} navigate={navigate} />
      </main>
      {showFooter && <Footer setPage={requestPage} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
