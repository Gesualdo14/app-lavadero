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
import { LoadingSpinner } from "@/components/custom-ui/Spinner";
import { saleFormSchema, type Sale } from "@/schemas/sale";
import MultiSelect from "@/components/custom-ui/MultiSelect";
import { EMPTY_SALE, useStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "@/components/custom-ui/DapePicker";

export function SaleFormDialog() {
  const queryClient = useQueryClient();
  const { update, openDialog, globalSearchText, sale, creating } = useStore();
  const form = useForm<Sale>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: sale,
  });

  const {
    formState: { isSubmitting },
    setError,
    reset,
    handleSubmit,
    control,
    register,
  } = form;

  const onSubmit = async (values: Sale) => {
    if (values.services?.length === 0) {
      setError("services", {
        message: "Debes seleccionar al menos 1 servicio",
      });
    }
    if (values.client?.length === 0) {
      setError("client", {
        message: "Debes seleccionar al cliente",
      });
    }
    if (values.vehicle?.length === 0) {
      setError("vehicle", {
        message: "Debes seleccionar un vehículo",
      });
      return;
    }
    const action = creating ? "createSale" : "updateSale";
    const result = await actions[action](values);
    console.log({ result });
    queryClient.refetchQueries({ queryKey: ["sales", globalSearchText] });

    toast({
      title: result.data?.message,
    });

    update("openDialog", "");
  };

  useEffect(() => {
    if (!openDialog) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
    if (openDialog === "sale") {
      form.setValue("id", sale.id);
      form.setValue("client", sale.client);
      form.setValue("sale_date", sale.sale_date);
      form.setValue("services", sale.services || []);
      form.setValue("vehicle", sale.vehicle);
      form.setValue("total_amount", sale.total_amount);
    }
  }, [openDialog]);

  const user = form.watch("client");
  console.log({ errors: form.formState.errors });

  return (
    <Dialog
      open={openDialog === "sale"}
      onOpenChange={(open) => {
        update("openDialog", !open ? "" : "sale");
        if (!open) {
          update("openSelect", "");
          update("openDatePicker", "");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          className="h-7 gap-1"
          onClick={() => {
            update("creating", true);
            update("openDialog", "sale");
            update("sale", EMPTY_SALE);
          }}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Nueva venta
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] top-[50px] translate-y-0"
        onClick={() => {
          update("openSelect", "");
          update("openDatePicker", "");
        }}
      >
        <DialogHeader>
          <DialogTitle>{creating ? "Nueva" : "Editando"} venta</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
            className="space-y-4"
          >
            <FormField
              control={control}
              name="sale_date"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DatePicker form={form} field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect
                      form={form}
                      field={field}
                      idToFocusAfterSelection="sale-vehicle"
                      resetOnSelect="vehicle"
                      entity={field.name}
                      justOne
                      autoFocus
                    />
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
                    <MultiSelect
                      id="sale-vehicle"
                      idToFocusAfterSelection="sale-service"
                      form={form}
                      field={field}
                      filterId={user?.length > 0 ? user[0].id : 0}
                      entity={field.name}
                      justOne
                    />
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
                    <MultiSelect
                      id="sale-service"
                      idToFocusAfterSelection="sale-amount"
                      form={form}
                      field={field}
                      entity="service"
                    />
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
                      id="sale-amount"
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
                {isSubmitting ? (
                  <LoadingSpinner />
                ) : creating ? (
                  "Crear"
                ) : (
                  "Editar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
