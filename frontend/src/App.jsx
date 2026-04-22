import { useState } from "react";
import { Navbar, Footer, GlobalStyles } from "./shared";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LangProvider } from "./context/LangContext";
import RightSidebar   from "./components/RightSidebar";
import LanguageSelector from "./components/LanguageSelector";
import AuthModal       from "./components/AuthModal";
import Home       from "./pages/Home";
import About      from "./pages/About";
import Contact    from "./pages/Contact";
import Register   from "./pages/Register";
import Login      from "./pages/Login";
import Dashboard  from "./pages/Dashboard";
import DonateMeal from "./pages/DonateMeal";

const PAGES = { Home, About, Contact, Register, Login, Dashboard, DonateMeal };

function AppInner() {
  const [page,          setPage]          = useState("Home");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();

  // Feature #1: clicking Home interactive elements opens modal, not redirects
  // setPage is used only for actual page navigation (non-Home protected pages)
  const navigate = (p) => setPage(p);

  const requestPage = (p) => {
    if ((p === "Dashboard" || p === "DonateMeal") && !user) {
      setShowAuthModal(true);   // show modal overlay instead of redirect
    } else if (p === "Login" || p === "Register") {
      setPage(p);               // full-page login/register for nav links
    } else {
      setPage(p);
    }
  };

  // Called from Home buttons when user is not logged in
  const requireAuth = (callback) => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      callback?.();
    }
  };

  const Page = PAGES[page] || Home;
  const showFooter = ["Home", "About"].includes(page);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <GlobalStyles />
      <Navbar
        page={page}
        setPage={requestPage}
        user={user}
        logout={() => { logout(); setPage("Home"); }}
      />
      <main key={page} style={{ animation: "fadeUp .4s ease" }}>
        <Page
          setPage={requestPage}
          navigate={navigate}
          requireAuth={requireAuth}
          showAuthModal={() => setShowAuthModal(true)}
        />
      </main>
      {showFooter && <Footer setPage={requestPage} />}

      {/* Right sidebar — always visible */}
      <RightSidebar currentPage={page} />

      {/* Language selector — always visible, bottom-left */}
      <LanguageSelector />

      {/* Auth modal overlay */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            // Stay on Home — user is now logged in
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <AppInner />
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
