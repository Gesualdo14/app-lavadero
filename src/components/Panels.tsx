import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStore } from "@/stores";
import SalesPanel from "./SalesPanel";
import UsersPanel from "./UsersPanel";
import ServicesPanel from "./ServicesPanel";
import ConfigPanel from "./ConfigPanel";
import DashboardPanel from "./DashboardPanel";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const Panels = () => {
  const panel = useStore((s) => s.panel);
  console.log({ panel });
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
