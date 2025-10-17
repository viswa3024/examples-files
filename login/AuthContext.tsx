"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  email: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const staticUsers = [
  { email: "john@example.com", password: "12345" },
  { email: "sara@i2c.com", password: "welcome" },
  { email: "mike@demo.com", password: "pass123" },
  { email: "emma@career.com", password: "career@2025" },
  { email: "admin@i2c.com", password: "admin123" },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const found = staticUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const token = btoa(`${email}:${Date.now()}`);
      const newUser = { email, token };
      sessionStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
