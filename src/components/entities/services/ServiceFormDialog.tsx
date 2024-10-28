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
import { useQueryClient } from "@tanstack/react-query";
import { EMPTY_SERVICE, useStore } from "@/stores";
import MyInput from "@/components/custom-ui/MyInput";

export function ServiceFormDialog() {
  const globalSearchText = useStore((s) => s.globalSearchText);
  // const service = useStore((s) => s.service);
  const update = useStore((s) => s.update);
  const creating = useStore((s) => s.creating);
  const loading = useStore((s) => s.loading);
  const openDialog = useStore((s) => s.openDialog);
  const queryClient = useQueryClient();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const values = useStore.getState().service;
    console.log({ values });
    update("loading", "service-form");
    const result =
      await actions[creating ? "createService" : "updateService"](values);
    console.log({ result });

    await queryClient.refetchQueries({
      queryKey: ["services", globalSearchText],
    });
    update("loading", "");
    toast({
      title: "Operación exitosa",
      description: result.data?.message,
    });
    update("openDialog", "");
  };

  return (
    <Dialog
      open={openDialog === "service"}
      onOpenChange={(open) => {
        if (!open) {
          update("openDialog", "");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          className="h-7 gap-1"
          onClick={() => {
            update("openDialog", "service");
            update("service", EMPTY_SERVICE);
            update("creating", true);
          }}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Crear servicio
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] top-[50px] translate-y-0">
        <DialogHeader>
          <DialogTitle>Crear servicio</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <MyInput entity="service" field="name" placeholder="Nombre..." />
          <MyInput
            type="number"
            entity="service"
            field="price"
            placeholder="Precio..."
          />

          <DialogFooter>
            <Button type="submit">
              {loading === "service-form" ? (
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
