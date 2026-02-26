import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface DemoUser {
  id: string;
  phone: string;
}

interface AuthContextType {
  user: User | DemoUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setDemoUser: (phone: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | DemoUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) setUser(session.user);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) setUser(session.user);
      setLoading(false);
    });

    // Check for demo user in sessionStorage
    const demoPhone = sessionStorage.getItem("demo_phone");
    if (demoPhone) {
      setUser({ id: "demo-" + demoPhone, phone: demoPhone });
      setLoading(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  const setDemoUser = (phone: string) => {
    sessionStorage.setItem("demo_phone", phone);
    setUser({ id: "demo-" + phone, phone });
  };

  const signOut = async () => {
    sessionStorage.removeItem("demo_phone");
    setUser(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, setDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
