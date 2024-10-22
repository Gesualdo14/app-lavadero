import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toMoney } from "@/helpers/fmt";

const DropdownWhatsapp = ({ sale }: { sale: any }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-haspopup="true"
          size="icon"
          variant="ghost"
          className="!ring-0 mt-0 block"
        >
          <img
            src="/whatsapp.png"
            className="!h-[1.8rem] !w-[1.8rem] hover:scale-105 transition-all"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center gap-1">
          {" "}
          <img src="/whatsapp.png" className="h-5 w-5" /> Mensajes
        </DropdownMenuLabel>
        <hr className="block my-1 text-gray-200 w-[90%] mx-auto" />
        <DropdownMenuItem
          className="cursor-pointer hover:!bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `https://api.whatsapp.com/send/?phone=${sale.client.phone}&text=${encodeURI(`Hola ${sale.client.firstname}, `)}`,
              "_blank"
            );
          }}
        >
          Iniciar conversación
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:!bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `https://api.whatsapp.com/send/?phone=${sale.client.phone}&text=${encodeURI(`${sale.client.firstname}, te enviamos este mensaje como comprobate de que ya has abonado *${toMoney(sale.gathered)}*.

En cuanto esté listo tu vehículo te vamos a contactar para que vengas a retirarlo.
                
¡Saludos! 🙋🏻‍♂️`)}`,
              "_blank"
            );
          }}
        >
          Cobro recibido
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:!bg-gray-100">
          Retirar vehículo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownWhatsapp;
