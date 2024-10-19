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
import { LoadingSpinner } from "../../custom-ui/Spinner";
import MultiSelect from "../../custom-ui/MultiSelect";
import { useStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";
import { cashflowFormSchema, type Cashflow } from "@/schemas/cashflow";
import SaleCashflowsTable from "./SaleCashflowsTable";

export function SaleCashflowsDialog() {
  const queryClient = useQueryClient();
  const { update, openDialog, sale, cashflow, creating, globalSearchText } =
    useStore();
  const form = useForm<Cashflow>({
    resolver: zodResolver(cashflowFormSchema),
    defaultValues: { sale_id: sale.id },
  });

  const {
    formState: { isSubmitting },
    reset,
    handleSubmit,
    control,
  } = form;

  const onSubmit = async (values: Cashflow) => {
    const action = creating ? "createCashflow" : "updateCashflow";
    const result = await actions[action]({
      ...values,
      sale_id: sale.id as number,
    });
    console.log({ result });
    reset({});
    queryClient.refetchQueries({ queryKey: ["cashflows", sale.id] });
    queryClient.refetchQueries({ queryKey: ["sales", globalSearchText] });

    toast({
      title: result.data?.message,
    });
    form.setValue("amount", 0);
    (document.querySelector("#select-amount") as HTMLButtonElement).focus();
    update("cashflow", { amount: 0 });
  };

  useEffect(() => {
    if (!openDialog) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
    form.reset(cashflow);
    form.setValue("sale_id", sale.id as number);
  }, [openDialog]);

  useEffect(() => {
    if (!creating && Array.isArray(cashflow.method)) {
      console.log({ creating, cashflow });
      form.setValue("id", cashflow.id);
      form.setValue("amount", cashflow.amount as number);
      form.setValue("method", cashflow.method);
    }

    form.setValue("sale_id", sale.id as number);
  }, [cashflow]);

  return (
    <Dialog
      open={openDialog === "cashflow"}
      onOpenChange={(open) => update("openDialog", !open ? "" : "cashflow")}
    >
      <DialogContent className="sm:max-w-[425px] top-[50px] translate-y-0">
        <DialogTitle>Cobros recibidos</DialogTitle>
        <SaleCashflowsTable sale_id={sale.id as number} />
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
                  update("cashflow", {
                    sale_id: sale.id,
                    amount: 0,
                    method: [],
                  });
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
                      id={"select-amount"}
                      idToFocusAfterSelection="cashflow-amount"
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
                      id="cashflow-amount"
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
