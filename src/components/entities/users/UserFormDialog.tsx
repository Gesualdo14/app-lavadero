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

export function UserFormDialog() {
  const queryClient = useQueryClient();
  const { update, openDialog, creating, user, globalSearchText } = useStore();
  const form = useForm<User>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user,
  });

  const { formState, reset, handleSubmit, control } = form;

  const onSubmit = async (values: User) => {
    const form = document.querySelector("#user-form") as HTMLFormElement;
    const formData = new FormData(form);
    formData.set("role", values.role ? values.role[0].name : "");
    const res = await actions.createUser(formData);
    console.log({ res });
    console.log({ values });

    toast({ title: "Usuario creado", description: "Usuario creado con éxito" });
    queryClient.refetchQueries({ queryKey: ["users", globalSearchText] });
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
            Crear usuario
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] top-[50px] translate-y-0">
        <DialogHeader>
          <DialogTitle>Datos del usuario</DialogTitle>
          <DialogDescription>
            Añade usuarios para que puedan iniciar sesión.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="user-form"
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
            <FormField
              control={control}
              name="role"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      name="file"
                      id=""
                      placeholder="Seleccionar..."
                    />
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
