import { CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Panel from "./Panel";
import { SaleFormDialog } from "./SaleFormDialog";
import SalesTable from "./SalesTable";

const SalesPanel = () => {
  return (
    <Panel>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>Ventas</CardTitle>
          <SaleFormDialog />
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
    </Panel>
  );
};

export default SalesPanel;
