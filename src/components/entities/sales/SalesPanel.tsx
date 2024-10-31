import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaleFormDialog } from "./SaleFormDialog";
import SalesTable from "./SalesTable";
import { SaleCashflowsDialog } from "@/components/entities/cashflows/SaleCashflowsDialog";
import { ClientFormDialog } from "../users/ClientFormDialog";
import { VehicleFormDialog } from "../vehicles/VehicleFormDialog";
import { getWeekOfYear } from "@/helpers/date";
import { Button } from "@/components/ui/button";
import { actions } from "astro:actions";
import { DatePicker } from "@/components/custom-ui/DapePicker";

const SalesPanel = () => {
  console.log({ week: getWeekOfYear(new Date()) });
  return (
    <Card
      x-chunk="dashboard-06-chunk-0"
      className="rounded-none sm:rounded-xl m-0 mt-0 h-full sm:h-auto border-0"
    >
      {/* <Button
        onClick={() => {
          actions.migrate();
        }}
      >
        MIGRATE
      </Button> */}
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <CardTitle>Ventas</CardTitle>
            <DatePicker entity="filter" field="date" format="PP" />
          </div>
          <div className="flex gap-2">
            <ClientFormDialog hidden dialogToOpen="sale" />
            <SaleFormDialog />
          </div>
          <SaleCashflowsDialog />
          <VehicleFormDialog dialogToOpen="sale" />
        </div>
      </CardHeader>
      <CardContent>
        <SalesTable />
      </CardContent>
    </Card>
  );
};

export default SalesPanel;
