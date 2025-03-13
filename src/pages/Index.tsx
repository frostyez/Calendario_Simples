
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Calendar, AlertTriangle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-light mb-4">Calendário Minimalista</h1>
        <p className="text-xl text-gray-600 mb-8">
          Uma forma simples e elegante de organizar seus eventos e compromissos.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button size="lg" className="gap-2">
              <LogIn className="h-4 w-4" />
              Entrar ou Registrar
            </Button>
          </Link>
          
          <Link to="/calendar-anonymous">
            <Button variant="outline" size="lg" className="gap-2">
              <Calendar className="h-4 w-4" />
              Usar sem login
            </Button>
          </Link>
        </div>
        
        <div className="mt-6 flex items-center justify-center text-amber-600 text-sm">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <p>Ao usar sem login, seus eventos não serão salvos.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
