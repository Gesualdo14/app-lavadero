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
import { EMPTY_USER, useStore } from "@/stores";

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

  const { formState, handleSubmit, control } = form;

  const onSubmit = async (values: User) => {
    const form = document.querySelector("#user-form") as HTMLFormElement;
    const formData = new FormData(form);
    formData.set("role", values.role ? values.role[0].name : "");
    formData.set("id", `${values.id}`);
    const action = creating ? "createUser" : "updateUser";
    const result = await actions[action](formData);

    console.log({ values });

    toast({ title: "Operación exitosa", description: result.data?.message });
    queryClient.refetchQueries({ queryKey: ["users", globalSearchText] });
    update("openDialog", "");
  };

  useEffect(() => {
    if (openDialog === "user") {
      form.setValue("id", user.id);
      form.setValue("firstname", user.firstname);
      form.setValue("lastname", user.lastname);
      form.setValue("email", user.email);
      form.setValue("password", user.password);
      form.setValue("role", user.role);
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
            update("user", EMPTY_USER);
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
            onSubmit={handleSubmit(onSubmit, (e) => {
              console.log({ e });
            })}
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
                    <Input type="email" placeholder="Email..." {...field} />
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
                      type="password"
                      placeholder="Contraseña..."
                      {...field}
                    />
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
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="avatar"
                        className="flex items-center justify-center w-full h-32 px-4 transition-colors border-2 border-dashed rounded-md cursor-pointer text-muted-foreground hover:border-primary hover:bg-primary/5"
                      >
                        <div className="space-y-1 text-center">
                          <svg
                            className="w-12 h-12 mx-auto text-muted-foreground"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-muted-foreground">
                            <span className="relative cursor-pointer outline-none ring-0 rounded-md font-medium text-primary focus-within:outline-none hover:underline">
                              <span>Upload a file</span>
                              <input
                                id="avatar"
                                type="file"
                                name={field.name}
                                onChange={field.onChange}
                                className="sr-only"
                              />
                            </span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </label>
                    </div>
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
