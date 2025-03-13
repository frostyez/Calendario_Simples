import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => Promise<boolean>;
  register: (emailOrPhone: string, password: string) => Promise<boolean>;
  logout: () => void;
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
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find(
        (u: any) => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        toast.success("Login realizado com sucesso!");
        return true;
      } else {
        toast.error("Credenciais inválidas");
        return false;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login");
      return false;
    }
  };

  const register = async (emailOrPhone: string, password: string): Promise<boolean> => {
    try {
      const isEmail = emailOrPhone.includes("@");
      
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      const userExists = users.some(
        (u: any) => 
          (isEmail && u.email === emailOrPhone) || 
          (!isEmail && u.phone === emailOrPhone)
      );

      if (userExists) {
        toast.error(`Este ${isEmail ? "e-mail" : "telefone"} já está cadastrado`);
        return false;
      }

      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        ...(isEmail ? { email: emailOrPhone } : { phone: emailOrPhone }),
        password
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast.success("Cadastro realizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error("Erro ao registrar");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logout realizado com sucesso!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
