import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Logo from "@/components/custom-ui/Logo";
import { Label } from "@/components/ui/label";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { actions } from "astro:actions";
import { toast } from "@/hooks/use-toast";
import { useStore } from "@/stores";
import { LoadingSpinner } from "@/components/custom-ui/Spinner";

export function LoginForm() {
  const { update, loading } = useStore();
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="w-full flex justify-center items-center">
          <Logo />
        </div>
      </CardHeader>
      <CardContent>
        <form id="login" className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="" required autoFocus />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" required placeholder="" />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          form="login"
          className="w-full"
          onClick={async () => {
            const email =
              document.querySelector<HTMLInputElement>("#email")?.value;
            const password =
              document.querySelector<HTMLInputElement>("#password")?.value;
            if (!email || !password) {
              return toast({
                title: "Datos incorrectos",
                description: "Debes rellenar ambos campos",
              });
            }
            update("loading", "login");
            const result = await actions.login({
              email,
              password,
            });
            console.log({ result });
            if (result.data?.ok) {
              await navigate("/");
              update("loading", "");
            } else {
              toast({
                title: result.data?.message,
                description: "Revise los datos ingresados",
              });
            }
          }}
        >
          {loading === "login" ? <LoadingSpinner /> : "Iniciar sesión"}
        </Button>
      </CardFooter>
    </Card>
  );
}
