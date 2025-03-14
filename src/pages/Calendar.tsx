
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, List, LogOut } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type Event = {
  id: string;
  title: string;
  date: Date;
  description?: string;
  color?: string;
  user_id?: string;
};

interface CalendarProps {
  anonymous?: boolean;
}

const Calendar = ({ anonymous = false }: CalendarProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Buscar eventos do Supabase quando o componente montar
  const fetchEvents = async () => {
    if (!user && !anonymous) return;
    
    setLoading(true);
    try {
      if (anonymous) {
        // Para modo anônimo, usar localStorage
        const savedEvents = localStorage.getItem("anonymous_events");
        if (savedEvents) {
          const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
            ...event,
            date: new Date(event.date)
          }));
          setEvents(parsedEvents);
        }
      } else {
        // Buscar eventos do Supabase para usuários autenticados
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('user_id', user?.id);
          
        if (error) {
          console.error("Erro ao buscar eventos:", error);
          toast.error("Erro ao carregar eventos");
          return;
        }
        
        // Converter datas de string para objeto Date
        const eventsWithDateObjects = data.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        
        setEvents(eventsWithDateObjects);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast.error("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user, anonymous]);

  // Salvar eventos no localStorage para modo anônimo
  useEffect(() => {
    if (anonymous) {
      localStorage.setItem("anonymous_events", JSON.stringify(events));
    }
  }, [events, anonymous]);

  // Redirect to login if not authenticated and not anonymous
  useEffect(() => {
    if (!user && !anonymous) {
      navigate("/login");
    }
  }, [user, navigate, anonymous]);

  const handleAddEvent = async (event: Omit<Event, "id">) => {
    if (anonymous) {
      // Modo anônimo: salvar no localStorage
      const newEvent = {
        ...event,
        id: Math.random().toString(36).substring(2, 9)
      };
      setEvents([...events, newEvent]);
      toast.success("Evento adicionado com sucesso!");
    } else {
      // Modo autenticado: salvar no Supabase
      try {
        const { data, error } = await supabase
          .from('events')
          .insert([{
            title: event.title,
            date: event.date.toISOString(),
            description: event.description,
            color: event.color,
            user_id: user?.id
          }])
          .select();
          
        if (error) {
          console.error("Erro ao adicionar evento:", error);
          toast.error("Erro ao adicionar evento");
          return;
        }
        
        // Adicionar o novo evento à lista com a data como objeto Date
        const newEvent = {
          ...data[0],
          date: new Date(data[0].date)
        };
        
        setEvents([...events, newEvent]);
        toast.success("Evento adicionado com sucesso!");
      } catch (error) {
        console.error("Erro ao adicionar evento:", error);
        toast.error("Erro ao adicionar evento");
      }
    }
  };
  
  const handleDeleteEvent = async (id: string) => {
    if (anonymous) {
      // Modo anônimo: remover do estado e localStorage
      setEvents(events.filter(event => event.id !== id));
      toast.success("Evento removido com sucesso!");
    } else {
      // Modo autenticado: remover do Supabase
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error("Erro ao remover evento:", error);
          toast.error("Erro ao remover evento");
          return;
        }
        
        setEvents(events.filter(event => event.id !== id));
        toast.success("Evento removido com sucesso!");
      } catch (error) {
        console.error("Erro ao remover evento:", error);
        toast.error("Erro ao remover evento");
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const selectedDateEvents = events.filter(
    (event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  // Sort all events by date
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

  if (!user && !anonymous) return null;

  return (
    <div className="container mx-auto p-4 max-w-6xl animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light text-center">Calendário Minimalista</h1>
        {!anonymous && (
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        )}
      </div>
      
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
                DayContent: (props) => {
                  const currentDate = props.date;
                  const dayEvents = events.filter(
                    (event) => format(event.date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                  );
                  
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {currentDate.getDate()}
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
              {format(date, "MMMM yyyy")}
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAllEvents(!showAllEvents)}
                className="flex items-center gap-1"
              >
                <List className="h-4 w-4" />
                {showAllEvents ? "Voltar" : "Todos Eventos"}
              </Button>
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              {showAllEvents ? (
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Mostrando todos os eventos
                </h3>
              ) : (
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  {format(date, "d 'de' MMMM 'de' yyyy")}
                </h3>
              )}
            </div>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando eventos...
              </div>
            ) : (
              <EventList 
                events={showAllEvents ? sortedEvents : selectedDateEvents} 
                onDeleteEvent={handleDeleteEvent}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
