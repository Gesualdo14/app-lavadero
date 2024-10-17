import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { SaleFormDialog } from "./SaleFormDialog";
import SalesTable from "./SalesTable";
import { SaleCashflowsDialog } from "./SaleCashflowsDialog";

const SalesPanel = () => {
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>Ventas</CardTitle>
          <SaleFormDialog />
          <SaleCashflowsDialog />
        </div>
      </CardHeader>
      <CardContent>
        <SalesTable />
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> ventas
        </div>
      </CardFooter>
    </Card>
  );
};

export default SalesPanel;
