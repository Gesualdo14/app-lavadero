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
} from "@/components/ui/table";
import { TableSkeletonComponent } from "@/components/custom-ui/Skeletons";
import { Badge } from "@/components/ui/badge";
import DeleteIcon from "@/components/custom-ui/DeleteIcon";

const UsersTable = () => {
  const { update, globalSearchText } = useStore();
  const { data: users, isPending } = useQuery({
    queryKey: ["users", globalSearchText],
    queryFn: async () => {
      const data = await actions.getUsers({
        searchText: globalSearchText || "",
        justClients: false,
      });
      return data?.data?.data || [];
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead className="min-w-24">Rol</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending ? (
          <TableSkeletonComponent />
        ) : (
          users?.map((u) => (
            <TableRow
              key={u.id}
              className="cursor-pointer"
              onClick={() => {
                console.log("CLICK");
                update("user", {
                  ...u,
                  role: [{ id: u.role === "Admin" ? 2 : 1, name: u.role }],
                  password: u.password,
                });

                update("openDialog", "user");
                update("creating", false);
              }}
            >
              <TableCell className="w-16">
                <img
                  src={"/avatar?id=" + u.id}
                  alt="Avatar"
                  className="overflow-hidden rounded w-10 h-10 object-cover"
                />
              </TableCell>
              <TableCell className="font-medium w-52">
                <div className="flex flex-col">
                  <span>
                    {u.firstname} {u.lastname}
                  </span>

                  <span className="text-[12px] text-gray-400 hidden sm:block font-normal">
                    {u.email}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="outline">{u.role}</Badge>
              </TableCell>
              <TableCell>
                <DeleteIcon
                  id={u.id}
                  entity="User"
                  queryKey={["users", globalSearchText]}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
