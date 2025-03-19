
import React from "react";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";

const Navigation = () => {
  return (
    <div className="w-full border-b">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <Link to="/">
            <span className="font-medium cursor-pointer">Calendário Minimalista</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
