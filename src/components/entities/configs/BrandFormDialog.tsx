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
import { useState } from "react";
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
import { navigate } from "astro:transitions/client";
import { brandFormSchema, type Brand } from "@/schemas/brand";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/stores";

const defaultValues = {
  name: "",
  company_id: 1,
};

export function BrandFormDialog() {
  const globalSearchText = useStore((s) => s.globalSearchText);
  const queryClient = useQueryClient();
  const form = useForm<Brand>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: defaultValues,
  });

  const { formState, reset, handleSubmit, control } = form;
  const [open, setOpen] = useState(false);

  const onSubmit = async (values: Brand) => {
    const result = await actions.createBrand(values);
    reset(defaultValues);
    queryClient.refetchQueries({ queryKey: ["brands", globalSearchText] });
    toast({
      title: "Marca creada",
      description: "Marca creada con éxito",
    });
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          className="h-7 gap-1"
          onClick={() => setOpen(true)}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Crear marca
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] top-[30%]">
        <DialogHeader>
          <DialogTitle>Crear marca</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {formState.isSubmitting ? <LoadingSpinner /> : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
