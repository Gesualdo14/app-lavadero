import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "./UsersTable";
import { ClientFormDialog } from "./ClientFormDialog";
import { UserFormDialog } from "./UserFormDialog";
import ClientsTable from "./ClientsTable";
import { VehicleFormDialog } from "../vehicles/VehicleFormDialog";

const UsersPanel = ({ justClients = false }: { justClients?: boolean }) => {
  return (
    <Card
      x-chunk="dashboard-06-chunk-0"
      className="rounded-none sm:rounded-xl m-0 mt-0 h-full sm:h-auto border-0"
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{justClients ? "Clientes" : "Usuarios"}</CardTitle>
          {justClients ? <ClientFormDialog /> : <UserFormDialog />}
          <VehicleFormDialog dialogToOpen="user" />
        </div>
      </CardHeader>
      <CardContent>
        {justClients ? <ClientsTable /> : <UsersTable />}
      </CardContent>
    </Card>
  );
};

export default UsersPanel;
