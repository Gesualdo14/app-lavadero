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
import { CircleDollarSign, PlusCircle } from "lucide-react";
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
import MultiSelect from "./MultiSelect";
import { useStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";
import { cashflowFormSchema, type Cashflow } from "@/schemas/cashflow";
import SaleCashflowsTable from "./SaleCashflowsTable";

export function SaleCashflowsDialog({ sale_id }: { sale_id: number }) {
  const queryClient = useQueryClient();
  const { update, openDialog, sale, cashflow, creating } = useStore();
  const form = useForm<Cashflow>({
    resolver: zodResolver(cashflowFormSchema),
    defaultValues: { sale_id },
  });

  const id = form.getValues("sale_id");
  console.log({ id, sale_id });

  const {
    formState: { isSubmitting },
    reset,
    handleSubmit,
    control,
  } = form;

  const onSubmit = async (values: Cashflow) => {
    const action = creating ? "createCashflow" : "updateCashflow";
    const result = await actions[action]({ ...values, sale_id });
    console.log({ result });
    reset({});
    queryClient.refetchQueries({ queryKey: ["cashflows", sale_id] });

    toast({
      title: result.data?.message,
    });

    update("openDialog", "");
    update("cashflow", {});
  };

  useEffect(() => {
    if (!openDialog) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  }, [openDialog]);

  useEffect(() => {
    console.log({ creating, cashflow });
    if (!creating && Array.isArray(cashflow.method)) {
      form.setValue("id", cashflow.id);
      form.setValue("amount", cashflow.amount);
      form.setValue("method", cashflow.method);
    } else {
      form.reset(cashflow);
    }
    form.setValue("sale_id", sale_id);
  }, [cashflow]);

  return (
    <Dialog
      open={openDialog === "cashflow"}
      onOpenChange={(open) => update("openDialog", !open ? "" : "cashflow")}
    >
      <DialogTrigger asChild>
        <CircleDollarSign
          className="h-5 w-5"
          onClick={(e) => {
            e.stopPropagation();
            update("creating", true);
            update("openDialog", "cashflow");
            update("cashflow", {
              sale_id,
            });
          }}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] top-[40%]">
        <DialogTitle>Cobros recibidos</DialogTitle>

        <SaleCashflowsTable sale_id={sale_id} />
        <DialogHeader>
          <div className="flex gap-3 items-center justify-between">
            <DialogTitle>{creating ? "Nuevo" : "Editando"} cobro</DialogTitle>
            {!creating && (
              <Button
                size="icon"
                variant="default"
                className="h-7 gap-1"
                onClick={() => {
                  update("creating", true);
                  update("cashflow", { sale_id, amount: 0, method: [] });
                }}
              >
                <PlusCircle className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, (e) => {
              console.log({ e });
            })}
            className="space-y-4"
          >
            <FormField
              control={control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect
                      form={form}
                      field={field}
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Monto..."
                      type="number"
                      value={field.value}
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
