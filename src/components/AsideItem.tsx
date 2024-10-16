import { CarFront, User, Bell, ChartAreaIcon, Settings } from "lucide-react";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { TooltipContent } from "./ui/tooltip";
import { useStore } from "@/stores";

interface Props {
  text: string;
  icon: "washes" | "services" | "clients" | "dashboard" | "settings";
  panel: string;
  tooltip?: boolean;
}

const AsideItem = ({ text, panel, icon, tooltip = true }: Props) => {
  const { update } = useStore();
  const icons = {
    washes: <CarFront className="h-5 w-5" />,
    services: <Bell className="h-5 w-5" />,
    clients: <User className="h-5 w-5" />,
    dashboard: <ChartAreaIcon className="h-5 w-5" />,
    settings: <Settings className="h-5 w-5" />,
  };

  if (!tooltip)
    return (
      <a
        onClick={() => update("panel", text.toLocaleLowerCase())}
        className="flex gap-3 items-center cursor-pointer justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
      >
        {icons[icon]}
        <span>{text}</span>
      </a>
    );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <a
            onClick={() => update("panel", panel.toLocaleLowerCase())}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
