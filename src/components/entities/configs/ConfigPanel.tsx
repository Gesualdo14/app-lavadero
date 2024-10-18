import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { BrandFormDialog } from "./BrandFormDialog.tsx";
import BrandsTable from "./BrandsTable.tsx";

const ConfigPanel = () => {
  return (
    <Card
      x-chunk="dashboard-06-chunk-0"
      className="rounded-none sm:rounded-xl m-0 mt-0 h-full sm:h-auto border-0"
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>Configuración</CardTitle>
          <BrandFormDialog />
        </div>
      </CardHeader>
      <CardContent>
        <BrandsTable />
      </CardContent>
    </Card>
  );
};

export default ConfigPanel;
