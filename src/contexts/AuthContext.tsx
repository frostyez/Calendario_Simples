
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<{success: boolean; rateLimited: boolean}>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Verificar sessão atual ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success("Login realizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login");
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<{success: boolean; rateLimited: boolean}> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // Check for rate limit error specifically
        if (error.message.includes("email rate limit exceeded")) {
          toast.error("Muitas tentativas de cadastro. Por favor, aguarde alguns minutos antes de tentar novamente.");
          return { success: false, rateLimited: true };
        } else {
          toast.error(error.message);
          return { success: false, rateLimited: false };
        }
      }

      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmação.");
      return { success: true, rateLimited: false };
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      
      // Network errors might also indicate rate limiting
      if (error.message && error.message.includes("NetworkError")) {
        toast.error("Problema de conexão ou muitas tentativas. Tente novamente mais tarde.");
        return { success: false, rateLimited: true };
      }
      
      toast.error("Erro ao registrar. Tente novamente mais tarde.");
      return { success: false, rateLimited: false };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
