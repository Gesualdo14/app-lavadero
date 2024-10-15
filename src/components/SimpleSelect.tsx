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
import { CheckIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import type { Sale } from "@/schemas/sale";

type Props =
  | {
      entity: "service";
      form: UseFormReturn<Sale>;
      field: ControllerRenderProps<Sale, "saleItems">;
    }
  | {
      entity: "vehicle";
      form: UseFormReturn<Sale>;
      field: ControllerRenderProps<Sale, "sale.vehicle_id">;
    };

const MultiSelect = ({ field, form, entity }: Props) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [entity],
    queryFn: async () => {
      const text = _searchText.get();
      const data = await actions[entity].get({
        searchText: text || "",
      });
      return data?.data?.data || [];
    },
  });
  const $openSelect = useStore(openSelect);
  const $searchText = useStore(_searchText);

  if (isPending) {
    return <span>Cargando...</span>;
  }

  if (isError) {
    return <span>Error al cargar los servicios</span>;
  }
  console.log({ value: field.value });
  const isOpen = $openSelect.includes(field.name);

  return (
    <Select open={isOpen}>
      <SelectTrigger
        className="w-full"
        onClick={() => {
          setTimeout(() => {
            document.getElementById("my-input")?.focus();
          }, 200);
          openSelect.set(
            isOpen
              ? $openSelect.filter((s) => s !== field.name)
              : $openSelect.concat(field.name)
          );
        }}
      >
        {field.value.length === 0 ? (
          <span className="text-gray-400">Servicios...</span>
        ) : (
          <div className="flex items-start gap-2 max-w-[250px] overflow-hidden">
            {field.value.length > 0 &&
              field.value.map((fv) => (
                <span key={fv.item_id} className="rounded-md bg-gray-100 px-3">
                  {fv.item_name}
                </span>
              ))}
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
                  if (e.code === "KeyP") {
                    e.stopPropagation();
                  }
                  if (e.code === "Enter") refetch();
                }}
                value={_searchText.get()}
                onChange={(e) => _searchText.set(e.target.value)}
                id="my-input"
                className="focus-visible:ring-0 border-0 outline-none pl-8 shadow-none"
                placeholder="Buscar servicio..."
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
            const isSelected = selectedItems.some((si) => si.item_id === i.id);
            return (
              <SelectItem
                onClick={() => {
                  const newValue = isSelected
                    ? selectedItems.filter((si) => si.item_id !== i.id)
                    : selectedItems.concat({
                        item_id: i.id,
                        price: i.price,
                        sale_id: 0,
                        item_name: i.name,
                      });
                  form.setValue(field.name, newValue);
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
              No se encontró ningún servicio
            </span>
          )}
          <Separator className="my-1 w-full" />
          <div className="flex justify-end w-full">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() =>
                openSelect.set($openSelect.filter((s) => s !== field.name))
              }
            >
              Cerrar
            </Button>
          </div>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default MultiSelect;
