import { useStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import MyDropdown from "./MyDropdown";
import { Badge } from "./ui/badge";

const UsersTable = () => {
  const { update, globalSearchText } = useStore();
  const { data: users, isPending } = useQuery({
    queryKey: ["users", globalSearchText],
    queryFn: async () => {
      const data = await actions.getUsers({
        searchText: globalSearchText || "",
      });
      return data?.data?.data || [];
    },
  });

  if (isPending) return "Loading...";

  console.log({ users });

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

export default UsersTable;
