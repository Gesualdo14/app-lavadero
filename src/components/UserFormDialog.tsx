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
import { LoadingSpinner } from "./Spinner";
import { saleFormSchema } from "@/schemas/sale";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import MultiSelect from "./MultiSelect";
import { useStore } from "@/stores";

export type Entities = "user" | "sale";

export const schemas = {
  user: userFormSchema,
  sale: saleFormSchema,
} as const;

export function UserFormDialog() {
  const queryClient = useQueryClient();
  const { update, openDialog, creating, user } = useStore();
  const form = useForm<User>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user,
  });

  const { formState, reset, handleSubmit, control } = form;
  console.log({ openDialog, creating, user, formState: form.getValues() });

  const onSubmit = async (values: User) => {
    console.log({ values });
    const action = creating ? "createUser" : "updateUser";
    const result = await actions[action](values);
    toast({ title: "Cliente creado", description: "Cliente creado con éxito" });
    queryClient.refetchQueries({ queryKey: ["users"] });
    update("openDialog", "");
  };
  console.log("DIOSSS");

  useEffect(() => {
    reset(user);
  }, [user]);

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
      <DialogContent className="sm:max-w-[425px] top-[200px]">
        <DialogHeader>
          <DialogTitle>Crear cliente</DialogTitle>
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
                <FormField
                  control={control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <QueryClientProvider client={queryClient}>
                          <MultiSelect
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
                        <Input placeholder="Modelo..." {...field} />
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
