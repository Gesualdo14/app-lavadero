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

import { LoadingSpinner } from "../../custom-ui/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/stores";
import { type FormEvent } from "react";
import MyInput from "@/components/custom-ui/MyInput";
import MultiSelect from "@/components/custom-ui/MultiSelect";
import { focusAfter } from "@/helpers/ui";

export function VehicleFormDialog({ dialogToOpen }: { dialogToOpen: string }) {
  const searchText = useStore((s) => s.searchText);
  const openDialog = useStore((s) => s.openDialog);
  const creating = useStore((s) => s.creating);
  const loading = useStore((s) => s.loading);
  const update = useStore((s) => s.update);
  const queryClient = useQueryClient();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const values = useStore.getState().vehicle;
    const brand = values.brand.length > 0 ? values.brand[0]?.name : "";
    let result = await actions.createVehicle({
      ...values,
      brand: brand as string,
    });
    queryClient.refetchQueries({ queryKey: ["vehicles"] });
    update("openDialog", dialogToOpen);
    update("creating", dialogToOpen === "sale");
    if (dialogToOpen === "sale") {
      update("sale", {
        vehicle: [
          {
            id: result.data?.data,
            name: `${brand} ${values.model}`,
          },
        ],
      });
      queryClient.refetchQueries({
        queryKey: ["vehicle", values.user_id, searchText],
      });

      focusAfter("sale-service", 70, true);
    }
    toast({
      title: "Operación exitosa",
      description: result.data?.message,
    });
  };

  return (
    <Dialog
      open={openDialog === "vehicle"}
      onOpenChange={(open) => {
        if (!open) {
          update("openDialog", "");
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px] top-[50px] translate-y-0">
        <DialogHeader>
          <DialogTitle>{creating ? "Crear" : "Editar"} marca</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <MultiSelect
            id="vehicle-brand"
            form="vehicle"
            entity="brand"
            field="brand"
            config="brand"
            idToFocusAfterSelection="vehicle-model"
            justOne
          />
          <MyInput
            id="vehicle-model"
            entity="vehicle"
            field="model"
            placeholder="Modelo..."
          />
          <MyInput entity="vehicle" field="patent" placeholder="Patente..." />
          <DialogFooter>
            <Button type="submit">
              {loading === "brand-form" ? (
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
