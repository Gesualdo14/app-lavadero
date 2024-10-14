import { Home, PanelLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import AsideItem from "./AsideItem";

const SheetItem = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs max-w-44">
        <nav className="flex flex-col items-start gap-4 px-2 py-4">
          <AsideItem text="Ventas" href="/" icon="washes" tooltip={false} />
          <AsideItem text="Servicios" icon="services" tooltip={false} />
          <AsideItem text="Clientes" icon="clients" tooltip={false} />
          <AsideItem text="Informes" icon="dashboard" tooltip={false} />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SheetItem;
