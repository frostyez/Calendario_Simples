
import React from "react";
import { Clock, Calendar, Trash2 } from "lucide-react";
import { Event } from "@/pages/Calendar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { formatDateCapitalized } from "@/utils/dateUtils";

type EventListProps = {
  events: Event[];
  onDeleteEvent?: (id: string) => void;
};

const EventList = ({ events, onDeleteEvent }: EventListProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Não há eventos para este dia
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (onDeleteEvent) {
      onDeleteEvent(id);
      toast({
        title: "Evento removido",
        description: "O evento foi removido com sucesso."
      });
    }
  };

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
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: event.color }}
              />
              {onDeleteEvent && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(event.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Remover evento</span>
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {formatDateCapitalized(event.date, "d 'de' MMMM 'de' yyyy")}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {formatDateCapitalized(event.date, "HH:mm")}
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
