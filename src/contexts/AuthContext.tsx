import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { clearAuthToken, getAuthToken } from "@/lib/api";
import type { AppUser } from "@/types/api";

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setAuthUser: (user: AppUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const persisted = localStorage.getItem("auth_user");
    if (token && persisted) {
      try {
        setUser(JSON.parse(persisted));
      } catch {
        clearAuthToken();
        localStorage.removeItem("auth_user");
      }
    }
    setLoading(false);
  }, []);

  const setAuthUser = (nextUser: AppUser) => {
    localStorage.setItem("auth_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const signOut = async () => {
    clearAuthToken();
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
