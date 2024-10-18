import { UserFormDialog } from "./UserFormDialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import ServicesTable from "./ServicesTable.tsx";
import { ServiceFormDialog } from "./ServiceFormDialog.tsx";

const ServicesPanel = () => {
  return (
    <Card
      x-chunk="dashboard-06-chunk-0"
      className="rounded-none sm:rounded-xl m-0 mt-0 h-full border-0"
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
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Mostrando <strong>1-10</strong> of <strong>32</strong> servicios
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServicesPanel;
