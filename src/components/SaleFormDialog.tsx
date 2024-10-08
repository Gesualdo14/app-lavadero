import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { actions } from "astro:actions";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "./Spinner";
import { navigate } from "astro:transitions/client";
import { saleFormSchema, type Sale } from "@/schemas/sale";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const defaultValues = {};

export function SaleFormDialog() {
  const form = useForm<Sale>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: defaultValues,
  });

  const { formState, reset, handleSubmit, control } = form;
  const [open, setOpen] = useState(false);

  const onSubmit = async (values: Sale) => {
    console.log({ values });
    const result = await actions.createSale(values);
    reset(defaultValues);
    await navigate("/");
    toast({ title: "Venta creada", description: "Venta creada con éxito" });
    setOpen(false);
  };
  console.log(open);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          className="h-7 gap-1"
          onClick={() => setOpen(true)}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Nueva venta
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva venta</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        form.setValue(field.name, +value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Cliente..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Usuarios</SelectLabel>
                          <SelectItem value="1">Martín</SelectItem>
                          <SelectItem value="2">Nico</SelectItem>
                          <SelectItem value="3">Fran</SelectItem>
                          <SelectItem value="4">Andy</SelectItem>
                          <SelectItem value="5">Nel</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="vehicle_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        form.setValue(field.name, +value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Vehículo..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Vehículos</SelectLabel>
                          <SelectItem value="1">Auto 1</SelectItem>
                          <SelectItem value="2">Camioneta</SelectItem>
                          <SelectItem value="3">Tractor</SelectItem>
                          <SelectItem value="4">Bici</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="service_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        form.setValue(field.name, +value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Servicios..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <div className="relative flex-1 w-full">
                            <MagnifyingGlassIcon className="absolute left-1.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="my-input"
                              className="focus-visible:ring-0 border-0 outline-none pl-8 shadow-none"
                              placeholder="Buscar servicio..."
                              autoFocus
                            />
                          </div>
                          <Separator className="my-1 w-full" />
                          <SelectItem
                            value="2"
                            className="hover:bg-gray-100 !rounded-md outline-none"
                          >
                            Lavado
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="total_amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Monto..."
                      type="number"
                      {...field}
                      onChange={(value) =>
                        field.onChange(value.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {formState.isSubmitting ? <LoadingSpinner /> : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
