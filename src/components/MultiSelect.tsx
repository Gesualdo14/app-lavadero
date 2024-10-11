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
import { useStore } from "@nanostores/react";
import { openSelect, _searchText } from "@/stores";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import type { Sale } from "@/schemas/sale";
import { CheckIcon, X } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  filterId?: number;
  justOne?: boolean;
  autoFocus?: boolean;
  resetOnSelect?: keyof Sale;
} & (
  | {
      entity: "service";
      form: UseFormReturn<Sale>;
      field: ControllerRenderProps<Sale, "services">;
    }
  | {
      entity: "vehicle";
      form: UseFormReturn<Sale>;
      field: ControllerRenderProps<Sale, "vehicle">;
    }
  | {
      entity: "user";
      form: UseFormReturn<Sale>;
      field: ControllerRenderProps<Sale, "user">;
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
  console.log(field.name, { filterId });
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [entity, filterId],
    queryFn: async () => {
      const text = _searchText.get();
      const data = await actions.getSelectItems({
        searchText: text || "",
        filterId,
        entity,
      });
      return data?.data?.data || [];
    },
  });
  const $openSelect = useStore(openSelect);
  const $searchText = useStore(_searchText);

  const { singular, plural, placeholder } = CONFIG[entity];

  if (isPending) {
    return <span>Cargando {plural}...</span>;
  }

  if (isError) {
    return <span>Error al cargar los {plural}</span>;
  }

  const isOpen = $openSelect.includes(field.name);
  const quantitySelected = field.value.length;

  return (
    <Select open={isOpen}>
      <SelectTrigger
        autoFocus={autoFocus}
        className="w-full"
        onClick={() => {
          setTimeout(() => {
            document.getElementById("my-input")?.focus();
          }, 200);
          openSelect.set(isOpen ? "" : field.name);
        }}
      >
        {quantitySelected === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <div className="flex items-start gap-2 max-w-[250px] overflow-hidden">
            {quantitySelected > 0 &&
              quantitySelected < 3 &&
              field.value.map((fv) => (
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
                value={_searchText.get()}
                onChange={(e) => _searchText.set(e.target.value)}
                id="my-input"
                className="focus-visible:ring-0 border-0 outline-none pl-8 shadow-none"
                placeholder={placeholder}
              />
              {!!$searchText && (
                <X
                  size={16}
                  className="text-muted-foreground cursor-pointer mr-3"
                  onClick={() => {
                    _searchText.set("");
                    refetch();
                  }}
                />
              )}
            </div>
          </div>
          <Separator className="my-1 w-full" />
          {data?.map((i) => {
            const selectedItems = form.watch(field.name);
            const isSelected = selectedItems.some((si) => si.id === i.id);
            return (
              <SelectItem
                onClick={() => {
                  const newValue = isSelected
                    ? selectedItems.filter((si) => si.id !== i.id)
                    : justOne
                      ? [i]
                      : selectedItems.concat(i);
                  form.setValue(field.name, newValue);
                  if (justOne) {
                    openSelect.set("");
                  }
                  if (!!resetOnSelect) {
                    form.resetField(resetOnSelect);
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
          {data.length === 0 && (
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
                  onClick={() => openSelect.set("")}
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
