
import React from "react";
import { format } from "date-fns";
import { Clock, Calendar } from "lucide-react";
import { Event } from "@/pages/Calendar";

type EventListProps = {
  events: Event[];
};

const EventList = ({ events }: EventListProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Não há eventos para este dia
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div 
          key={event.id} 
          className="p-3 rounded-lg border transition-all hover:shadow-md hover:scale-[1.01]"
          style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{event.title}</h3>
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: event.color }}
            />
          </div>
          
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {format(event.date, "d 'de' MMMM 'de' yyyy")}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {format(event.date, "HH:mm")}
            </div>
          </div>
          
          {event.description && (
            <p className="text-sm mt-2 text-muted-foreground">
              {event.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventList;
