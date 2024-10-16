import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import { Label } from "@/components/ui/label";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { actions } from "astro:actions";
import { toast } from "@/hooks/use-toast";

export function LoginForm() {
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
            const result = await actions.login({
              email,
              password,
            });
            console.log({ result });
            if (result.data?.ok) {
              await navigate("/");
            } else {
              toast({
                title: result.data?.message,
                description: "Revise los datos ingresados",
              });
            }
          }}
        >
          Iniciar sesión
        </Button>
      </CardFooter>
    </Card>
  );
}
