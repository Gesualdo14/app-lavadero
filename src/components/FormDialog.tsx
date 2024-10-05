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
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { actions } from "astro:actions";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema } from "@/schemas/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "./Spinner";
import { navigate } from "astro:transitions/client";
import type { SelectUser } from "@/db/schema";

const defValues = {
  firstname: "",
  lastname: "",
  email: "",
};

export function FormDialog() {
  const form = useForm<SelectUser>({
    resolver: zodResolver(formSchema),
    defaultValues: defValues,
  });
  const { formState, reset, handleSubmit, control } = form;
  const [open, setOpen] = useState(false);

  const onSubmit = async (values: SelectUser) => {
    const result = await actions.createUser(values);
    reset(defValues);
    toast({
      title: "Cliente creado",
      description: result.data?.message,
    });
    setOpen(false);
    await navigate("/");
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
            Crear cliente
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear cliente</DialogTitle>
          <DialogDescription>
            Añade clientes para luego poder crear ventas que se asocien a ellos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="firstname"
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
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Apellido..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email..." {...field} />
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
