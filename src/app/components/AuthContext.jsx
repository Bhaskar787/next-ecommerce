"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Load user safely
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        const parsed = JSON.parse(storedUser);
        // Normalize id field so components can rely on `_id`
        if (parsed && !parsed._id && parsed.id) parsed._id = parsed.id;
        setUser(parsed);
      }
    } catch (error) {
      console.log("User parse error:", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = (userData) => {
    const normalized = { ...userData };
    if (!normalized._id && normalized.id) normalized._id = normalized.id;
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login"); // ✅ Better than window.location
  };

  return (
    <AuthContext.Provider
      value={{ user, loginUser, logoutUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);