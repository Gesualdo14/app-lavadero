import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import type { Sale } from "@/schemas/sale";
import { useStore } from "@/stores";
import { es } from "date-fns/locale";

type Props = {
  form: UseFormReturn<Sale>;
  field: ControllerRenderProps<Sale, "sale_date">;
};

export function DatePicker({ form, field }: Props) {
  const update = useStore((s) => s.update);
  const openDatePicker = useStore((s) => s.openDatePicker);

  const isOpen = openDatePicker === field.name;
  console.log({ value: field.value });

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          onClick={(e) => {
            e.stopPropagation();
            update("openDatePicker", isOpen ? "" : field.name);
          }}
          className={cn(
            "justify-start text-left font-normal w-full",
            !field.value && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {field.value ? (
            format(field.value, "PPP", { locale: es })
          ) : (
            <span>Fecha de la venta</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Calendar
          className="w-full"
          mode="single"
          locale={es}
          selected={new Date(field.value)}
          onSelect={(date) => {
            console.log({ date });
            form.setValue(field.name, date?.toUTCString() as string);
            update("openDatePicker", "sale");
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
