import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { BrandFormDialog } from "./BrandFormDialog";
import BrandsTable from "./BrandsTable.tsx";

const BrandsPanel = () => {
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>Clientes</CardTitle>
          <BrandFormDialog />
        </div>
      </CardHeader>
      <CardContent>
        <BrandsTable />
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> clientes
        </div>
      </CardFooter>
    </Card>
  );
};

export default BrandsPanel;
