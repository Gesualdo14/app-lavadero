import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { CheckIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/schemas/user";
import type { Sale } from "@/schemas/sale";
import { useStore } from "@/stores";
import type { Cashflow } from "@/schemas/cashflow";
import { DropdownSkeletonComponent } from "./Skeletons";

type Props = {
  id?: string;
  idToFocusAfterSelection?: string;
  filterId?: number;
  justOne?: boolean;
  autoFocus?: boolean;
} & (
  | {
      entity: "vehicle";
      form: UseFormReturn<Sale>;
      field: ControllerRenderProps<Sale, "vehicle">;
      resetOnSelect?: keyof Sale;
    }
  | {
      entity: "client";
      form: UseFormReturn<Sale>;
      field: ControllerRenderProps<Sale, "client">;
      resetOnSelect?: keyof Sale;
    }
  | {
      entity: "service";
      form: UseFormReturn<Sale>;
      field: ControllerRenderProps<Sale, "services">;
      resetOnSelect?: keyof Sale;
    }
  | {
      entity: "brand";
      form: any;
      field: ControllerRenderProps<User, "brand">;
      resetOnSelect?: keyof User;
    }
  | {
      entity: "role";
      form: any;
      field: ControllerRenderProps<User, "role">;
      resetOnSelect?: keyof User;
    }
  | {
      entity: "method";
      form: any;
      field: ControllerRenderProps<Cashflow, "method">;
      resetOnSelect?: keyof Cashflow;
    }
);

const CONFIG = {
  role: {
    placeholder: "Roles...",
    singular: "rol",
    plural: "roles",
  },
  service: {
    placeholder: "Servicios...",
    singular: "servicio",
    plural: "servicios",
  },
  client: {
    placeholder: "Clientes...",
    singular: "cliente",
    plural: "clientes",
  },
  vehicle: {
    placeholder: "Vehículos...",
    singular: "vehículo",
    plural: "vehículos",
  },
  brand: {
    placeholder: "Marcas...",
    singular: "marca",
    plural: "marcas",
  },
  method: {
    placeholder: "Método de pago...",
    singular: "método de pago",
    plural: "métodos de pago",
  },
};

const MultiSelect = ({
  id,
  idToFocusAfterSelection,
  field,
  form,
  entity,
  filterId,
  resetOnSelect,
  justOne = false,
  autoFocus = false,
}: Props) => {
  const { searchText, update, openSelect } = useStore();
  const { data, refetch, isPending } = useQuery({
    queryKey: [entity, filterId, searchText],
    queryFn: async () => {
      const data = await actions.getItems({
        searchText: searchText || "",
        filterId,
        entity,
      });
      return data?.data?.data || [];
    },
  });

  const { singular, plural, placeholder } = CONFIG[entity];

  const isOpen = openSelect === field.name;
  const quantitySelected = field.value?.length as number;

  let selectedItems = form.watch(field.name as any) as any;

  const handleItemSelection = (item: { id: number; name: string }) => {
    const isSelected = selectedItems?.some((si: any) => si.id === item.id);
    const newValue = isSelected
      ? selectedItems.filter((si: any) => si.id !== item.id)
      : justOne
        ? [item]
        : selectedItems.concat(item);

    form.setValue(field.name, newValue);

    if (justOne) {
      update("openSelect", "");
      update("searchText", "");
    }
    if (!!resetOnSelect) {
      console.log({ value: field.value, resetOnSelect });
      form.setValue(resetOnSelect, []);
    }

    if (field.name === "services") {
      const totalAmount = newValue.reduce(
        (p: number, c: any) => p + (c.value ?? 0),
        0
      );
      form.setValue("total_amount", totalAmount);
    }

    form.clearErrors(field.name);
    if (!!idToFocusAfterSelection) {
      const element = document.querySelector(
        `#${idToFocusAfterSelection}`
      ) as HTMLElement;
      const timeout = setTimeout(() => {
        element.focus();
      }, 2);
    }
  };

  return (
    <Select
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setTimeout(() => {
            let dialog = document.querySelector(
              "div[role=dialog]"
            ) as HTMLDivElement;
            dialog.style.pointerEvents = "auto";
            dialog = document.querySelector(
              "div[role=dialog]"
            ) as HTMLDivElement;
          }, 150);
        }
      }}
    >
      <SelectTrigger
        id={id}
        autoFocus={autoFocus}
        className="w-full"
        onKeyDown={(e) => {
          e.stopPropagation();
          if (["Enter", "ArrowDown"].includes(e.code)) {
            update("openSelect", field.name);
          }
          setTimeout(() => {
            document.getElementById("my-input")?.focus();
          }, 50);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setTimeout(() => {
            document.getElementById("my-input")?.focus();
          }, 50);
          update("openSelect", isOpen ? "" : field.name);
          update("searchText", "");
        }}
      >
        {quantitySelected === 0 || !quantitySelected ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <div className="flex items-start gap-2 max-w-[250px] overflow-hidden">
            {quantitySelected > 0 &&
              quantitySelected < 3 &&
              field?.value?.map((fv) => (
                <span key={fv.id} className="rounded-md bg-gray-100 px-3">
                  {fv.name}
                </span>
              ))}
            {quantitySelected > 2 && (
              <span className="rounded-md bg-gray-100 px-3">
                {quantitySelected} {plural} seleccionados
              </span>
            )}
          </div>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div className="relative flex-1 w-full">
            <MagnifyingGlassIcon className="absolute left-1.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <div className="flex items-center justify-end w-full">
              <Input
                onKeyDown={(e) => {
                  e.stopPropagation();

                  if (e.code === "Enter") {
                    const input = document.querySelector(
                      "#my-input"
                    ) as HTMLInputElement;
                    update("searchText", input.value);
                    refetch();
                  }
                  if (e.code === "ArrowDown") {
                    console.log("FOCUS??");
                    const element = document.querySelector(
                      "#item-0"
                    ) as HTMLElement;
                    element.focus();
                  }
                }}
                onChange={(e) => {
                  if (!e.target.value) {
                    update("searchText", "");
                    refetch();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                id="my-input"
                className="focus-visible:ring-0 border-0 outline-none pl-8 shadow-none <placeholder:text-gray-4></placeholder:text-gray-4>00"
                placeholder={"Buscar..."}
              />

              {!!searchText && (
                <X
                  size={16}
                  className="text-muted-foreground cursor-pointer mr-3"
                  onClick={() => {
                    update("searchText", "");
                    refetch();
                  }}
                />
              )}
            </div>
          </div>
          <Separator className="my-1 w-full" />
          {isPending && <DropdownSkeletonComponent />}
          {data?.map((i, index) => {
            const isSelected = selectedItems?.some((si: any) => si.id === i.id);
            return (
              <SelectItem
                id={`item-${index}`}
                onKeyDown={(e) => {
                  if (["ArrowDown"].includes(e.code)) {
                    update("openSelect", field.name);
                    const id = index === data.length - 1 ? 0 : index + 1;
                    document.getElementById(`item-${id}`)?.focus();
                  }
                  if (["ArrowUp"].includes(e.code)) {
                    update("openSelect", field.name);
                    const id = index === 0 ? data.length - 1 : index - 1;
                    document.getElementById(`item-${id}`)?.focus();
                  }
                  if (e.code === "Enter") {
                    handleItemSelection(i);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemSelection(i);
                }}
                key={i.id}
                value={`${i.id}`}
                className={`hover:bg-gray-100 focus:bg-blue-100 my-1 ${isSelected ? "bg-gray-100" : ""} !rounded-md outline-none cursor-pointer`}
              >
                {i.name}
                {isSelected && (
                  <span className="absolute right-2 top-2.5 flex h-3.5 w-3.5 items-center justify-center">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                )}
              </SelectItem>
            );
          })}
          {data?.length === 0 && (
            <span className="block text-muted-foreground p-4 text-sm">
              No se encontró ningún {singular}
            </span>
          )}
          {!justOne && (
            <>
              <Separator className="my-1 w-full" />
              <div className="flex justify-end w-full">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    update("openSelect", "");
                    update("searchText", "");
                  }}
                >
                  Cerrar
                </Button>
              </div>
            </>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default MultiSelect;
