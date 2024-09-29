import { CarFront, User, Bell, ChartAreaIcon, Settings } from "lucide-react";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { TooltipContent } from "./ui/tooltip";

interface Props {
  text: string;
  icon: "washes" | "services" | "clients" | "dashboard" | "settings";
}

const AsideItem = ({ text, icon }: Props) => {
  const icons = {
    washes: <CarFront className="h-5 w-5" />,
    services: <Bell className="h-5 w-5" />,
    clients: <User className="h-5 w-5" />,
    dashboard: <ChartAreaIcon className="h-5 w-5" />,
    settings: <Settings className="h-5 w-5" />,
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <a
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            {icons[icon]}
            <span className="sr-only">{text}</span>
          </a>
        </TooltipTrigger>
        <TooltipContent side="right">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AsideItem;
