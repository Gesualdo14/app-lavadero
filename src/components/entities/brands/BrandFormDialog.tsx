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

import { LoadingSpinner } from "../../custom-ui/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { EMPTY_BRAND, useStore } from "@/stores";
import { type FormEvent } from "react";
import MyInput from "@/components/custom-ui/MyInput";

export function BrandFormDialog() {
  const globalSearchText = useStore((s) => s.globalSearchText);
  const openDialog = useStore((s) => s.openDialog);
  const creating = useStore((s) => s.creating);
  const loading = useStore((s) => s.loading);
  const update = useStore((s) => s.update);
  const queryClient = useQueryClient();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const values = useStore.getState().brand;
    let result;
    if (creating) {
      result = await actions.createBrand(values);
    } else {
      result = await actions.updateBrand({
        name: values.name,
        id: values.id as number,
      });
    }
    await queryClient.refetchQueries({
      queryKey: ["brands", globalSearchText],
    });
    update("openDialog", "");
    toast({
      title: "Operación exitosa",
      description: result.data?.message,
    });
  };

  return (
    <Dialog
      open={openDialog === "brand"}
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
            update("brand", EMPTY_BRAND);
            update("openDialog", "brand");
            update("creating", true);
          }}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Crear marca
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] top-[50px] translate-y-0">
        <DialogHeader>
          <DialogTitle>{creating ? "Crear" : "Editar"} marca</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <MyInput entity="brand" field="name" />
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
