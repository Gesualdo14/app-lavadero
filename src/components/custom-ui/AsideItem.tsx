import {
  Bell,
  ChartAreaIcon,
  Settings,
  CircleDollarSign,
  Users,
  Tags,
  UserCog2,
} from "lucide-react";

import { useStore } from "@/stores";
import { navigate } from "astro:transitions/client";

interface Props {
  text: string;
  icon:
    | "washes"
    | "services"
    | "clients"
    | "dashboard"
    | "settings"
    | "brands"
    | "users";
  panel: string;
  tooltip?: boolean;
}

const AsideItem = ({ text, panel, icon, tooltip = true }: Props) => {
  const selectedPanel = useStore((s) => s.panel);
  const globalSearchText = useStore((s) => s.globalSearchText);
  const update = useStore((s) => s.update);

  const iconsClasses =
    "h-5 w-5 transition-transform duration-300 cursor-pointer group-hover:scale-110";

  const icons = {
    washes: <CircleDollarSign className={iconsClasses} />,
    services: <Bell className={iconsClasses} />,
    clients: <Users className={iconsClasses} />,
    dashboard: <ChartAreaIcon className={iconsClasses} />,
    settings: <Settings className={iconsClasses} />,
    brands: <Tags className={iconsClasses} />,
    users: <UserCog2 className={iconsClasses} />,
  };

  if (!tooltip)
    return (
      <a
        onClick={() => {
          update("panel", text.toLocaleLowerCase());
          update("sheetOpen", false);
          if (!!globalSearchText) {
            update("globalSearchText", null);
            navigate("/");
          }
          localStorage.setItem("selectedPanel", panel);
        }}
        className="flex gap-3 items-center  cursor-pointer justify-center rounded-md text-muted-foreground transition-bg hover:text-foreground md:h-8 md:w-8"
      >
        {icons[icon]}
        <span>{text}</span>
      </a>
    );

  const isSelected = selectedPanel === panel;

  return (
    <a
      onClick={() => {
        update("panel", panel.toLocaleLowerCase());
        update("sheetOpen", false);
        if (!!globalSearchText) {
          update("globalSearchText", "");
          const search_input = document.getElementById(
            "input-search"
          ) as HTMLInputElement;
          search_input.value = "";
          navigate("/");
        }
      }}
      className={`group flex h-9 w-9 shrink-0 items-center justify-center md:h-8 md:w-8 md:text-base ${isSelected ? "gap-2 rounded-lg bg-primary text-lg font-semibold text-primary-foreground" : ""}`}
    >
      {icons[icon]}
      <span className="sr-only">{text}</span>
    </a>
  );
};

export default AsideItem;
