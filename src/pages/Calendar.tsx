
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";

export type Event = {
  id: string;
  title: string;
  date: Date;
  description?: string;
  color?: string;
};

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Meeting with Team",
      date: new Date(),
      description: "Discuss project progress",
      color: "#4f46e5",
    },
    {
      id: "2",
      title: "Lunch with Client",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      description: "Discuss new requirements",
      color: "#f97316",
    },
  ]);

  const handleAddEvent = (event: Omit<Event, "id">) => {
    const newEvent = {
      ...event,
      id: Math.random().toString(36).substring(2, 9),
    };
    setEvents([...events, newEvent]);
  };

  // Get events for the selected date
  const selectedDateEvents = events.filter(
    (event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl animate-fade-in">
      <h1 className="text-3xl font-light mb-8 text-center">Calendário Minimalista</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-7 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-light">
              {format(date, "MMMM yyyy")}
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  const prevMonth = new Date(date);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setDate(prevMonth);
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  const nextMonth = new Date(date);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setDate(nextMonth);
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md"
              components={{
                DayContent: ({ day }) => {
                  const dayEvents = events.filter(
                    (event) => format(event.date, "yyyy-MM-dd") === format(day.date, "yyyy-MM-dd")
                  );
                  
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {day.date.getDate()}
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 flex gap-1 justify-center">
                          {dayEvents.slice(0, 3).map((event, index) => (
                            <div
                              key={event.id}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: event.color }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-5 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-light">
              {format(date, "d MMMM yyyy")}
            </CardTitle>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Adicionar Evento</SheetTitle>
                  <SheetDescription>
                    Preencha os detalhes do novo evento
                  </SheetDescription>
                </SheetHeader>
                <EventForm onAddEvent={handleAddEvent} selectedDate={date} />
              </SheetContent>
            </Sheet>
          </CardHeader>
          <CardContent>
            <EventList events={selectedDateEvents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
