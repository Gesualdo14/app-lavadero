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
import { LoadingSpinner } from "@/components/custom-ui/Spinner";
import { serviceFormSchema, type Service } from "@/schemas/service";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/stores";

const defaultValues = {
  name: "",
  company_id: 1,
};

export function ServiceFormDialog() {
  const globalSearchText = useStore((s) => s.globalSearchText);
  const queryClient = useQueryClient();
  const form = useForm<Service>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: defaultValues,
  });

  const { formState, reset, handleSubmit, control } = form;
  const [open, setOpen] = useState(false);

  const onSubmit = async (values: Service) => {
    const result = await actions.createService(values);
    reset(defaultValues);

    queryClient.refetchQueries({ queryKey: ["services", globalSearchText] });
    toast({
      title: "Servicio creado",
      description: "Servicio creado con éxito",
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
            Crear servicio
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] top-[50px] translate-y-0">
        <DialogHeader>
          <DialogTitle>Crear servicio</DialogTitle>
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
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Precio..."
                      {...field}
                      onChange={(value) =>
                        field.onChange(value.target.valueAsNumber)
                      }
                    />
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
