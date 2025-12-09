// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

// 🔐 Import Firebase client from correct location
import { auth } from "../firebase/client";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Set default admin Gmail (can override from .env if needed)
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        localStorage.removeItem("ss_admin_token");
        setLoading(false);
        return;
      }

      try {
        const tokenResult = await firebaseUser.getIdTokenResult(true);
        const isAdmin = firebaseUser.email === ADMIN_EMAIL;

        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "",
          role: isAdmin ? "admin" : "user",
          token: tokenResult.token,
        };

        setUser(userData);
        localStorage.setItem("ss_admin_token", tokenResult.token);
      } catch (error) {
        console.error("AuthContext Error:", error);
        setUser(null);
        localStorage.removeItem("ss_admin_token");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [ADMIN_EMAIL]);

  // 🔵 LOGIN
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // 🔴 LOGOUT
  function logout() {
    signOut(auth);
    setUser(null);
    localStorage.removeItem("ss_admin_token");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 🪝 custom hook: useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
