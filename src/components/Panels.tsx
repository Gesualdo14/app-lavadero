import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStore } from "@/stores";
import SalesPanel from "./SalesPanel";
import UsersPanel from "./UsersPanel";
import ServicesPanel from "./ServicesPanel";
import ConfigPanel from "./ConfigPanel";
import DashboardPanel from "./DashboardPanel";
import { useLayoutEffect } from "react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const Panels = ({ searchParams }: { searchParams: any }) => {
  const panel = useStore((s) => s.panel);
  const update = useStore((s) => s.update);
  console.log({ panel, searchParams });

  useLayoutEffect(() => {
    const currentPanel = localStorage.getItem("panel");
    update("panel", currentPanel);
    update("globalSearchText", searchParams);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      {panel === "ventas" && <SalesPanel />}
      {panel === "clientes" && <UsersPanel />}
      {panel === "servicios" && <ServicesPanel />}
      {panel === "informes" && <DashboardPanel />}
      {panel === "config" && <ConfigPanel />}
    </QueryClientProvider>
  );
};

export default Panels;
