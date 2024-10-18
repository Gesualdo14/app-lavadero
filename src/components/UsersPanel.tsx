import { UserFormDialog } from "./UserFormDialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import UsersTable from "./UsersTable";

const UsersPanel = () => {
  return (
    <Card
      x-chunk="dashboard-06-chunk-0"
      className="rounded-none sm:rounded-xl m-0 mt-0 h-full border-0"
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
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> clientes
        </div>
      </CardFooter>
    </Card>
  );
};

export default UsersPanel;
