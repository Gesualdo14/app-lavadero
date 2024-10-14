import { UserFormDialog } from "./UserFormDialog";
import { CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Panel from "./Panel";
import UsersTable from "./UsersTable";

const UsersPanel = () => {
  return (
    <Panel>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>Clientes</CardTitle>
          <UserFormDialog />
        </div>
      </CardHeader>
      <CardContent>
        <UsersTable />
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> clientes
        </div>
      </CardFooter>
    </Panel>
  );
};

export default UsersPanel;
