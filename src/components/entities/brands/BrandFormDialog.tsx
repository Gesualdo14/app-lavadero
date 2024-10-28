import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { actions } from "astro:actions";
import { PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "../../custom-ui/Spinner";
import { brandFormSchema, type Brand } from "@/schemas/brand";
import { useQueryClient } from "@tanstack/react-query";
import { EMPTY_BRAND, useStore } from "@/stores";
import { useEffect } from "react";

export function BrandFormDialog() {
  const globalSearchText = useStore((s) => s.globalSearchText);
  const openDialog = useStore((s) => s.openDialog);
  const creating = useStore((s) => s.creating);
  const brand = useStore((s) => s.brand);
  const update = useStore((s) => s.update);
  const queryClient = useQueryClient();
  const form = useForm<Brand>({
    resolver: zodResolver(brandFormSchema),
  });

  const { formState, reset, handleSubmit, control } = form;

  const onSubmit = async (values: Brand) => {
    let result;
    if (creating) {
      result = await actions.createBrand(values);
    } else {
      result = await actions.updateBrand({
        name: values.name,
        id: values.id as number,
      });
    }
    reset(EMPTY_BRAND);
    queryClient.refetchQueries({ queryKey: ["brands", globalSearchText] });
    update("openDialog", "");
    toast({
      title: "Operación exitosa",
      description: result.data?.message,
    });
  };

  useEffect(() => {
    form.setValue("name", brand?.name as string);
    form.setValue("id", brand.id);
  }, [brand]);

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
            update("brand", {});
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
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
            className="space-y-4"
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nombre..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {formState.isSubmitting ? (
                  <LoadingSpinner />
                ) : creating ? (
                  "Crear"
                ) : (
                  "Editar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
