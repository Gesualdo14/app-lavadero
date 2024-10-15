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

export function LoginForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="w-full flex justify-center items-center">
          <Logo />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ingresa un correo válido..."
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            required
            placeholder="Ingresa tu contraseña..."
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={async () => await navigate("/")}>
          Iniciar sesión
        </Button>
      </CardFooter>
    </Card>
  );
}
