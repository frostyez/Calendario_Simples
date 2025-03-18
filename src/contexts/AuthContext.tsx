
import React, { createContext, useContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In this simplified version, users are always "authenticated" since we're removing login
  const isAuthenticated = true;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
