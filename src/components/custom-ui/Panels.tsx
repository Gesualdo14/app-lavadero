import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStore } from "@/stores";
import SalesPanel from "@/components/entities/sales/SalesPanel";
import UsersPanel from "@/components/entities/users/UsersPanel";
import ServicesPanel from "@/components/entities/services/ServicesPanel";
import BrandsPanel from "@/components/entities/brands/BrandsPanel";
import DashboardPanel from "@/components/entities/reports/DashboardPanel";
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
    let currentPanel = localStorage.getItem("panel");

    if (!currentPanel) {
      localStorage.setItem("panel", "ventas");
      currentPanel = "ventas";
    }

    update("panel", currentPanel);
    update("globalSearchText", searchParams);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      {panel === "ventas" && <SalesPanel />}
      {panel === "clientes" && <UsersPanel justClients />}
      {panel === "usuarios" && <UsersPanel />}
      {panel === "servicios" && <ServicesPanel />}
      {panel === "marcas" && <BrandsPanel />}
      {panel === "informes" && <DashboardPanel />}
      {panel === "config" && <BrandsPanel />}
    </QueryClientProvider>
  );
};

export default Panels;
