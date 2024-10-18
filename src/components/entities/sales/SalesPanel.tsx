import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SaleFormDialog } from "./SaleFormDialog";
import SalesTable from "./SalesTable";
import { SaleCashflowsDialog } from "@/components/entities/cashflows/SaleCashflowsDialog";

const SalesPanel = () => {
  return (
    <Card
      x-chunk="dashboard-06-chunk-0"
      className="rounded-none sm:rounded-xl m-0 mt-0 h-full sm:h-auto border-0"
    >
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
    </Card>
  );
};

export default SalesPanel;
