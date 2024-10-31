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
import { useStore, type Store } from "@/stores";
import { es } from "date-fns/locale";

type SelectableStates = Pick<
  Store,
  "vehicle" | "service" | "user" | "sale" | "filter"
>;

type Props<E extends keyof SelectableStates> = {
  entity: E;
  field: keyof SelectableStates[E];
  dateFormat?: "PP" | "PPP";
};

export function DatePicker<E extends keyof SelectableStates>({
  entity,
  field,
  dateFormat = "PP",
}: Props<E>) {
  const update = useStore((s) => s.update);
  const openDatePicker = useStore((s) => s.openDatePicker);
  const value = useStore((s) => s[entity][field]) as Date;

  const isOpen = openDatePicker === field;
  console.log({ value });

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          onClick={(e) => {
            e.stopPropagation();
            update("openDatePicker", isOpen ? "" : field);
          }}
          className={cn(
            "justify-start text-left font-normal w-full",
            !field && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {value ? (
            format(value, dateFormat, { locale: es })
          ) : (
            <span>
              {entity === "filter" ? "Filtro de fecha" : "Fecha de la venta"}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Calendar
          className="w-full"
          mode="single"
          locale={es}
          selected={new Date(value)}
          onSelect={(date) => {
            console.log({ date });
            update(entity, { [field]: date?.toUTCString() as string });
            update("openDatePicker", "");
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
