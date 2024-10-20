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
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userFormSchema, type User } from "@/schemas/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "../../custom-ui/Spinner";
import { saleFormSchema } from "@/schemas/sale";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import MultiSelect from "../../custom-ui/MultiSelect";
import { useStore } from "@/stores";

export type Entities = "user" | "sale";

export const schemas = {
  user: userFormSchema,
  sale: saleFormSchema,
} as const;

export function ClientFormDialog() {
  const queryClient = useQueryClient();
  const { update, openDialog, creating, user, globalSearchText } = useStore();
  const form = useForm<User>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user,
  });

  const { formState, handleSubmit, control } = form;

  const onSubmit = async (values: User) => {
    console.log({ values });
    const action = creating ? "createClient" : "updateClient";
    const result = await actions[action](values);
    toast({
      title: "Operación exitosa",
      description: result.data?.message,
    });
    queryClient.refetchQueries({ queryKey: ["clients", globalSearchText] });
    update("openDialog", "");
  };

  useEffect(() => {
    if (openDialog === "user") {
      form.setValue("id", user.id);
      form.setValue("company_id", user.company_id);
      form.setValue("firstname", user.firstname);
      form.setValue("lastname", user.lastname);
      form.setValue("email", user.email);
      form.setValue("phone", user.phone);
    }
  }, [openDialog]);

  return (
    <Dialog
      open={openDialog === "user"}
      onOpenChange={(open) => update("openDialog", !open ? "" : "user")}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          className="h-7 gap-1"
          onClick={() => {
            update("openDialog", "user");
            update("creating", true);
          }}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Crear cliente
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] top-[50px] translate-y-0">
        <DialogHeader>
          <DialogTitle>Datos del cliente</DialogTitle>
          <DialogDescription>
            Añade clientes para luego poder crear ventas que se asocien a ellos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            onError={() => {
              console.log("ERROR");
            }}
          >
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Teléfono..." {...field} />
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
            {creating && (
              <>
                <h2 className="block font-bold !-mb-2">Datos del vehículo</h2>
                <FormField
                  control={control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <QueryClientProvider client={queryClient}>
                          <MultiSelect
                            idToFocusAfterSelection="vehicle-model"
                            form={form}
                            field={field}
                            entity={field.name}
                            justOne
                          />
                        </QueryClientProvider>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="vehicle-model"
                          placeholder="Modelo..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="patent"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Patente..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
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
