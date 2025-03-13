
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, Calendar as CalendarIcon, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Navigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full border-b">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <span className="font-medium">Calendário Minimalista</span>
        </div>
        <div>
          {isAuthenticated ? (
            <Link to="/calendar">
              <Button variant="ghost" size="sm">Meu Calendário</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="sm" className="gap-1">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {!isAuthenticated && window.location.pathname === '/calendar-anonymous' && (
        <div className="container mx-auto px-4 pb-2">
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Você está usando o calendário sem estar logado. Seus eventos não serão salvos quando sair da página.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default Navigation;
