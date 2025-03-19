import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Event } from "@/pages/Calendar";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { formatDateCapitalized } from "@/utils/dateUtils";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  date: z.date({
    required_error: "Data é obrigatória",
  }),
  time: z.string().optional(),
  description: z.string().optional(),
  color: z.string().default("#4f46e5"),
});

type FormData = z.infer<typeof formSchema>;

type EventFormProps = {
  onAddEvent: (event: Omit<Event, "id">) => void;
  selectedDate: Date;
};

const EventForm = ({ onAddEvent, selectedDate }: EventFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: selectedDate,
      time: format(new Date(), "HH:mm"),
      description: "",
      color: "#4f46e5",
    },
  });

  const onSubmit = (data: FormData) => {
    const eventDate = new Date(data.date);
    
    // Se houver um horário definido, atualize a data com esse horário
    if (data.time) {
      const [hours, minutes] = data.time.split(':').map(Number);
      eventDate.setHours(hours, minutes);
    }
    
    onAddEvent({
      title: data.title,
      date: eventDate,
      description: data.description,
      color: data.color,
    });
    form.reset();
    toast({
      title: "Evento adicionado",
      description: "Seu evento foi adicionado com sucesso.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Adicione um título" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        formatDateCapitalized(field.value, "PPP")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={ptBR}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="time" 
                    className="w-full" 
                    {...field} 
                  />
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione uma descrição"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-3">
                  <Input
                    type="color"
                    className="w-12 h-8 p-1"
                    {...field}
                  />
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: field.value }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-6">Adicionar Evento</Button>
      </form>
    </Form>
  );
};

export default EventForm;
