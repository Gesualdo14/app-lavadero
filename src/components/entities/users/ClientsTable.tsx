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

const ClientsTable = () => {
  const { update, globalSearchText } = useStore();
  const { data: users, isPending } = useQuery({
    queryKey: ["clients", globalSearchText],
    queryFn: async () => {
      const data = await actions.getUsers({
        searchText: globalSearchText || "",
        justClients: true,
      });
      return data?.data?.data || [];
    },
  });

  console.log({ users });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead className="min-w-24">Email</TableHead>
          <TableHead>
            <span className="sr-only">Acciones</span>
          </TableHead>
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
                update("user", { ...u, role: [{ id: 1, name: u.role }] });
                update("openDialog", "user");
                update("creating", false);
              }}
            >
              <TableCell className="font-medium">{u.firstname}</TableCell>
              <TableCell>{u.lastname}</TableCell>
              <TableCell className="text-ellipsis max-w-1 sm:text-inherit md:overflow-visible overflow-hidden">
                {u.email}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
