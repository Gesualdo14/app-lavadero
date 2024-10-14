import { _creating, _globalSearchText, openDialog } from "@/stores";
import MyDropdown from "./MyDropdown";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { actions } from "astro:actions";
import { UserFormDialog } from "./UserFormDialog";
import { useStore } from "@/stores/user";
import { CardContent, CardHeader, CardTitle } from "./ui/card";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const UserCard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>Clientes</CardTitle>
          <UserFormDialog />
        </div>
      </CardHeader>
      <CardContent>
        <UserTable />
      </CardContent>
    </QueryClientProvider>
  );
};

const UserTable = () => {
  const { update } = useStore();
  const { data: users } = useQuery(
    {
      queryKey: ["users"],
      queryFn: async () => {
        const text = _globalSearchText.get();
        console.log("HOLI", { text });
        const data = await actions.getUsers({
          searchText: text || "",
          asItems: false,
        });
        return data?.data?.data || [];
      },
    },
    queryClient
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead className="min-w-24">Email</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((u) => (
          <TableRow
            key={u.id}
            className="cursor-pointer"
            onClick={() => {
              console.log("CLICK");
              update("user", u);
              update("openDialog", "user");
              update("creating", false);
            }}
          >
            <TableCell className="font-medium">{u.firstname}</TableCell>
            <TableCell>
              <Badge variant="outline">{u.lastname}</Badge>
            </TableCell>
            <TableCell className="text-ellipsis max-w-1 sm:text-inherit md:overflow-visible overflow-hidden">
              {u.email}
            </TableCell>
            <TableCell>
              <MyDropdown />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserCard;
