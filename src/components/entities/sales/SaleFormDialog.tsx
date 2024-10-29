import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { actions } from "astro:actions";
import { PlusCircle } from "lucide-react";
import { type FormEvent } from "react";

import { LoadingSpinner } from "@/components/custom-ui/Spinner";
import MultiSelect from "@/components/custom-ui/MultiSelect";
import { EMPTY_SALE, useStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "@/components/custom-ui/DapePicker";
import MyInput from "@/components/custom-ui/MyInput";

export function SaleFormDialog() {
  const queryClient = useQueryClient();
  const creating = useStore((s) => s.creating);
  const globalSearchText = useStore((s) => s.globalSearchText);
  const openDialog = useStore((s) => s.openDialog);
  const loading = useStore((s) => s.openDialog);
  const update = useStore((s) => s.update);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const action = creating ? "createSale" : "updateSale";
    const values = useStore.getState().sale;
    update("loading", "sale-form");
    const result = await actions[action](values);
    console.log({ result });
    await queryClient.refetchQueries({ queryKey: ["sales", globalSearchText] });
    await queryClient.invalidateQueries({ queryKey: ["reports"] });
    update("loading", "");

    toast({
      title: result.data?.message,
    });

    update("openDialog", "");
  };

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
            update("openDialog", "sale");
            update("sale", EMPTY_SALE);
            update("creating", true);
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

        <form onSubmit={onSubmit} className="space-y-4">
          <DatePicker entity="sale" field="sale_date" />
          <MultiSelect
            entity="client"
            form="sale"
            field="client"
            config="client"
            idToFocusAfterSelection="sale-vehicle"
            resetOnSelect="vehicle"
            justOne
          />
          <MultiSelect
            id="sale-vehicle"
            entity="vehicle"
            form="sale"
            filterIdField="client"
            field="vehicle"
            config="vehicle"
            idToFocusAfterSelection="sale-service"
            justOne
          />
          <MultiSelect
            id="sale-service"
            entity="service"
            form="sale"
            field="services"
            config="service"
            idToFocusAfterSelection="sale-amount"
          />

          <MyInput
            id="sale-amount"
            type="number"
            entity="sale"
            field="total_amount"
            placeholder="Monto..."
          />

          <DialogFooter>
            <Button type="submit">
              {loading === "sale-form" ? (
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
