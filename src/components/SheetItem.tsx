import { Home, PanelLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import AsideItem from "./AsideItem";
import { useStore } from "@/stores";

const SheetItem = () => {
  const open = useStore((s) => s.sheetOpen);
  const update = useStore((s) => s.update);
  return (
    <Sheet open={open}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="sm:hidden"
          onClick={() => update("sheetOpen", true)}
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs max-w-44">
        <nav className="flex flex-col items-start gap-4 px-2 py-4">
          <AsideItem
            panel="ventas"
            text="Ventas"
            icon="washes"
            tooltip={false}
          />
          <AsideItem
            panel="servicios"
            text="Servicios"
            icon="services"
            tooltip={false}
          />
          <AsideItem
            panel="clientes"
            text="Clientes"
            icon="clients"
            tooltip={false}
          />
          <AsideItem
            panel="informes"
            text="Informes"
            icon="dashboard"
            tooltip={false}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SheetItem;
