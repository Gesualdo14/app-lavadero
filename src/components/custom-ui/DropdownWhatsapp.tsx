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
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
              `https://api.whatsapp.com/send/?phone=${sale.client.phone}&text=${encodeURI(`Hi *${sale.client.firstname}*, `)}`,
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
              `https://api.whatsapp.com/send/?phone=${sale.client.phone}&text=${encodeURI(`*${sale.client.firstname}*, you are very welcome to Auto Spa Palmas del Mar, we are happy to have you here.

We have received your car. You will be texted again when your vehicle is ready to pick up.

*IMPORTANT DISCLAIMER*
We want you to know we are not responsible for articles left in locked or unlocked compartments in your vehicle or for damage and claims made after vehicle leaves premises.

We will always do everything possible to protect all property but ask that you help us by removing all visible articles.

¡THANK YOU! 🙋🏻‍♂️


Auto SPA Palmas del Mar.`)}`,
              "_blank"
            );
          }}
        >
          Disclaimer
        </DropdownMenuItem>
        {sale.gathered > 0 && (
          <DropdownMenuItem
            className="cursor-pointer hover:!bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `https://api.whatsapp.com/send/?phone=${sale.client.phone}&text=${encodeURI(`*${sale.client.firstname}*, we've succesfully received your payment of *${toMoney(sale?.gathered)}*.

Remember, you will be emailed you when your vehicle is ready to pick up.

¡THANK YOU!
Auto SPA Palmas del Mar.`)}`,
                "_blank"
              );
            }}
          >
            Cobro recibido
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer hover:!bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `https://api.whatsapp.com/send/?phone=${sale.client.phone}&text=${encodeURI(`*${sale.client.firstname}*, we've already finished to wash your vehicle, we wait for you to pick it up.

We have our doors opened until *5:30 p.m*.

See you soon!
Auto SPA Palmas del Mar.`)}`,
              "_blank"
            );
          }}
        >
          Retirar vehículo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownWhatsapp;
