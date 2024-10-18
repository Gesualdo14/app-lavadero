import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServicesTable from "./ServicesTable.tsx";
import { ServiceFormDialog } from "./ServiceFormDialog.tsx";

const ServicesPanel = () => {
  return (
    <Card
      x-chunk="dashboard-06-chunk-0"
      className="rounded-none sm:rounded-xl m-0 mt-0 h-full sm:h-auto border-0"
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>Servicios</CardTitle>
          <ServiceFormDialog />
        </div>
      </CardHeader>
      <CardContent>
        <ServicesTable />
      </CardContent>
    </Card>
  );
};

export default ServicesPanel;
