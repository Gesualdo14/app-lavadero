import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { actions } from "astro:actions";
import { PlusCircle } from "lucide-react";
import { type FormEvent } from "react";
import { LoadingSpinner } from "../../custom-ui/Spinner";
import MultiSelect from "../../custom-ui/MultiSelect";
import { useStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";
import SaleCashflowsTable from "./SaleCashflowsTable";
import MyInput from "@/components/custom-ui/MyInput";
import { focusAfter } from "@/helpers/ui";

export function SaleCashflowsDialog() {
  const queryClient = useQueryClient();

  const creating = useStore((s) => s.creating);
  const globalSearchText = useStore((s) => s.globalSearchText);
  const openDialog = useStore((s) => s.openDialog);
  const loading = useStore((s) => s.loading);
  const update = useStore((s) => s.update);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const values = useStore.getState().cashflow;
    const sale = useStore.getState().sale;
    const action = creating ? "createCashflow" : "updateCashflow";
    update("loading", "cashflow-form");
    const result = await actions[action]({
      ...values,
      amount: values.amount as number,
      sale_id: sale.id as number,
    });
    console.log({ result });
    await queryClient.refetchQueries({ queryKey: ["sales", globalSearchText] });
    await queryClient.refetchQueries({ queryKey: ["cashflows", sale.id] });

    update("loading", "");
    toast({
      title: result.data?.message,
    });
    (document.querySelector("#select-amount") as HTMLButtonElement).focus();
    update("cashflow", { method: [], amount: "" });
  };

  return (
    <Dialog
      open={openDialog === "cashflow"}
      onOpenChange={(open) => {
        update("openDialog", !open ? "" : "cashflow");
      }}
    >
      <DialogContent
        className="sm:max-w-[425px] top-[50px] translate-y-0"
        onEscapeKeyDown={(e) => {
          const openSelect = useStore.getState().openSelect;
          if (!!openSelect) {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle>Cobros recibidos</DialogTitle>
        <SaleCashflowsTable />
        <DialogHeader>
          <div className="flex gap-3 items-center justify-between">
            <DialogTitle>{creating ? "Nuevo" : "Editando"} cobro</DialogTitle>
            {!creating && (
              <Button
                size="icon"
                variant="default"
                className="h-7 gap-1"
                onClick={() => {
                  const sale = useStore.getState().sale;
                  update("creating", true);
                  update("cashflow", {
                    sale_id: sale.id,
                    amount: 0,
                    method: [],
                  });
                  update("cashflow", { method: [], amount: "" });
                  focusAfter("select-amount", 0, true);
                }}
              >
                <PlusCircle className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <MultiSelect
            id="select-amount"
            idToFocusAfterSelection="cashflow-amount"
            form="cashflow"
            field="method"
            entity="method"
            config="method"
            justOne
            autoFocus
          />

          <MyInput
            id="cashflow-amount"
            placeholder="Monto..."
            entity="cashflow"
            field="amount"
            type="number"
          />

          <DialogFooter>
            <Button type="submit">
              {loading === "cashflow-form" ? (
                <LoadingSpinner />
              ) : creating ? (
                "Crear"
              ) : (
                "Editar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
