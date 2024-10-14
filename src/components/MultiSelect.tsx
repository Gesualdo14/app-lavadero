import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "./ui/select";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { CheckIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import type { User } from "@/schemas/user";
import type { Sale } from "@/schemas/sale";
import { useStore } from "@/stores";

type Props = {
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
      entity: "user";
      form: UseFormReturn<Sale>;
      field: ControllerRenderProps<Sale, "user">;
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
);

const CONFIG = {
  service: {
    placeholder: "Servicios...",
    singular: "servicio",
    plural: "servicios",
  },
  user: { placeholder: "Clientes...", singular: "cliente", plural: "clientes" },
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
};

const MultiSelect = ({
  field,
  form,
  entity,
  filterId,
  resetOnSelect,
  justOne = false,
  autoFocus = false,
}: Props) => {
  const { searchText, update, openSelect } = useStore();
  const { data, refetch } = useQuery({
    queryKey: [entity, filterId, searchText],
    queryFn: async () => {
      const data = await actions.getSelectItems({
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

  return (
    <Select open={isOpen}>
      <SelectTrigger
        autoFocus={autoFocus}
        className="w-full"
        onClick={() => {
          setTimeout(() => {
            document.getElementById("my-input")?.focus();
          }, 200);
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
                  if (e.code === "KeyP" || e.code === "KeyM") {
                    e.stopPropagation();
                  }
                  if (e.code === "Enter") refetch();
                }}
                value={searchText}
                onChange={(e) => update("searchText", e.target.value)}
                id="my-input"
                className="focus-visible:ring-0 border-0 outline-none pl-8 shadow-none"
                placeholder={placeholder}
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
          {data?.map((i) => {
            let selectedItems = form.watch(field.name as any) as any;
            const isSelected = selectedItems?.some((si: any) => si.id === i.id);
            return (
              <SelectItem
                onClick={() => {
                  const newValue = isSelected
                    ? selectedItems.filter((si: any) => si.id !== i.id)
                    : justOne
                      ? [i]
                      : selectedItems.concat(i);

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
                }}
                key={i.id}
                value={`${i.id}`}
                className={`hover:bg-gray-100 my-1 ${isSelected ? "bg-gray-100" : ""} !rounded-md outline-none cursor-pointer`}
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
