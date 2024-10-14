import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { Card } from "./ui/card";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const Panel = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Card x-chunk="dashboard-06-chunk-0">{children}</Card>
    </QueryClientProvider>
  );
};

export default Panel;
