import { ClientFormDialog } from "./ClientFormDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "./UsersTable";
import { UserFormDialog } from "./UserFormDialog";

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
        </div>
      </CardHeader>
      <CardContent>
        <UsersTable justClients={justClients} />
      </CardContent>
    </Card>
  );
};

export default UsersPanel;
