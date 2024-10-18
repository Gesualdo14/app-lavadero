import { UserFormDialog } from "./UserFormDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "./UsersTable";

const UsersPanel = () => {
  return (
    <Card
      x-chunk="dashboard-06-chunk-0"
      className="rounded-none sm:rounded-xl m-0 mt-0 h-full sm:h-auto border-0"
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>Clientes</CardTitle>
          <UserFormDialog />
        </div>
      </CardHeader>
      <CardContent>
        <UsersTable />
      </CardContent>
    </Card>
  );
};

export default UsersPanel;
