import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // hydrating from localStorage

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("rqm_token");
    const storedUser  = localStorage.getItem("rqm_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem("rqm_token", newToken);
    localStorage.setItem("rqm_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("rqm_token");
    localStorage.removeItem("rqm_user");
    setToken(null);
    setUser(null);
  };

  // Convenience: returns auth header object for fetch / axios calls
  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authHeader, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
