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
import { useEffect } from "react";
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
import { saleFormSchema, type Sale, type TSelect } from "@/schemas/sale";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MultiSelect from "./MultiSelect";
import { useStore } from "@/stores/user";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const defaultValues: Sale = {
  services: [],
  user: [],
  vehicle: [],
  total_amount: 0,
};

export function SaleFormDialog() {
  const form = useForm<Sale>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: defaultValues,
  });
  const { update, openDialog } = useStore();

  const {
    formState: { errors, isSubmitting },
    getFieldState,
    setError,
    reset,
    handleSubmit,
    control,
    register,
    watch,
  } = form;

  const onSubmit = async (values: Sale) => {
    if (values.services.length === 0) {
      setError("services", {
        message: "Debes seleccionar al menos 1 servicio",
      });
    }
    if (values.user.length === 0) {
      setError("user", {
        message: "Debes seleccionar al cliente",
      });
    }
    if (values.vehicle.length === 0) {
      setError("vehicle", {
        message: "Debes seleccionar un vehículo",
      });
      return;
    }
    const result = await actions.createSale(values);
    console.log({ result });
    reset(defaultValues);
    await navigate("/");

    toast({
      title: result.data?.ok ? "Venta creada" : "Hubo un error",
      description: result.data?.message,
      className: "top-0 right-0",
    });

    update("openDialog", "");
  };

  useEffect(() => {
    if (!openDialog) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  }, [openDialog]);

  const services = watch("services");
  useEffect(() => {
    const totalAmount = services.reduce((p, c) => p + (c.value ?? 0), 0);
    form.setValue("total_amount", totalAmount);
  }, [services]);

  const user = form.watch("user");
  console.log({ user });

  return (
    <Dialog
      open={openDialog === "sale"}
      onOpenChange={(open) => update("openDialog", !open ? "" : "sale")}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          className="h-7 gap-1"
          onClick={() => update("openDialog", "sale")}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Nueva venta
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] top-[30%]">
        <DialogHeader>
          <DialogTitle>Nueva venta</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <QueryClientProvider client={queryClient}>
                      <MultiSelect
                        form={form}
                        field={field}
                        resetOnSelect="vehicle"
                        entity={field.name}
                        justOne
                        autoFocus
                      />
                    </QueryClientProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <QueryClientProvider client={queryClient}>
                      <MultiSelect
                        form={form}
                        field={field}
                        filterId={user.length > 0 ? user[0].id : 0}
                        entity={field.name}
                        justOne
                      />
                    </QueryClientProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              {...register("services", {
                minLength: { value: 1, message: "Debes elegir un servicio" },
              })}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <QueryClientProvider client={queryClient}>
                      <MultiSelect form={form} field={field} entity="service" />
                    </QueryClientProvider>
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
              <Button
                type="submit"
                onClick={() => {
                  console.log({ state: getFieldState("services") });
                }}
              >
                {isSubmitting ? <LoadingSpinner /> : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
