import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { actions } from "astro:actions";
import { PlusCircle } from "lucide-react";
import { type FormEvent } from "react";
import { LoadingSpinner } from "../../custom-ui/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import MultiSelect from "../../custom-ui/MultiSelect";
import { EMPTY_SALE, EMPTY_USER, useStore } from "@/stores";
import MyInput from "@/components/custom-ui/MyInput";
import { focusAfter } from "@/helpers/ui";
import { isValidPhone } from "@/helpers/validations";
import VehiclesTable from "../vehicles/VehiclesTable";

export type Entities = "user" | "sale";

export function ClientFormDialog({
  hidden = false,
  dialogToOpen,
}: {
  hidden?: boolean;
  dialogToOpen?: string;
}) {
  const queryClient = useQueryClient();
  const searchText = useStore((s) => s.searchText);
  const creating = useStore((s) => s.creating);
  const globalSearchText = useStore((s) => s.globalSearchText);
  const openDialog = useStore((s) => s.openDialog);
  const loading = useStore((s) => s.openDialog);
  const update = useStore((s) => s.update);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const values = useStore.getState().user;
    const action = creating ? "createClient" : "updateClient";
    console.log({ action });
    const validPhone = isValidPhone(values.phone || "");
    if (!validPhone) {
      toast({
        title: "Teléfono inválido",
        description:
          "Debe empezar con +1, tener 1 dígitos y utilizar un código de área válido",
      });
      return;
    }
    update("loading", "client-form");
    let result;
    if (creating) {
      result = await actions.createClient(values);
    } else {
      result = await actions.updateClient({
        id: values.id as number,
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        phone: values.phone,
      });
    }

    toast({
      title: "Operación exitosa",
      description: result.data?.message,
    });
    queryClient.refetchQueries({ queryKey: ["clients", globalSearchText] });
    queryClient.invalidateQueries({
      queryKey: ["client", undefined, searchText],
    });
    if (creating && dialogToOpen) {
      update("sale", {
        ...EMPTY_SALE,
        client: [
          {
            id: result.data?.data?.user_id,
            name: `${values.firstname} ${values.lastname}`,
          },
        ],
        vehicle: [
          {
            id: result.data?.data?.vehicle_id,
            name: `${values.brand ? values.brand[0].name : ""} ${values.model}`,
          },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });
      update("openDialog", dialogToOpen);
      focusAfter("sale-service", 50, true);
    }
    update("loading", "");
  };

  return (
    <Dialog
      open={openDialog === "user"}
      onOpenChange={(open) => update("openDialog", !open ? "" : "user")}
    >
      {!hidden && (
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="default"
            className="h-7 gap-1"
            onClick={() => {
              update("user", EMPTY_USER);
              update("creating", true);
              update("openDialog", "user");
            }}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Crear cliente
            </span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        className="sm:max-w-[425px] top-[50px] translate-y-0"
        onEscapeKeyDown={(e) => {
          const openSelect = useStore.getState().openSelect;
          if (!!openSelect) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Datos del cliente</DialogTitle>
          <DialogDescription>
            Añade clientes para luego poder crear ventas que se asocien a ellos.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="space-y-4"
          onError={() => {
            console.log("ERROR");
          }}
        >
          <MyInput entity="user" field="firstname" placeholder="Nombre..." />
          <MyInput entity="user" field="lastname" placeholder="Apellido..." />
          <MyInput entity="user" field="phone" placeholder="Teléfono..." />
          <MyInput
            type="email"
            entity="user"
            field="email"
            placeholder="Email..."
          />

          {creating && (
            <>
              <h2 className="block font-bold !-mb-2">Datos del vehículo</h2>

              <MultiSelect
                form="user"
                entity="brand"
                field="brand"
                config="brand"
                idToFocusAfterSelection="vehicle-model"
                justOne
              />

              <MyInput
                id="vehicle-model"
                entity="user"
                field="model"
                placeholder="Modelo..."
              />
              <MyInput entity="user" field="patent" placeholder="Patente..." />
            </>
          )}
          <DialogFooter>
            <Button type="submit">
              {loading === "user-form" ? (
                <LoadingSpinner />
              ) : creating ? (
                "Crear"
              ) : (
                "Editar"
              )}
            </Button>
          </DialogFooter>
          {!creating && <VehiclesTable />}
        </form>
      </DialogContent>
    </Dialog>
  );
}
