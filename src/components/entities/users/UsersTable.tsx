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

const UsersTable = ({ justClients = false }: { justClients?: boolean }) => {
  const { update, globalSearchText } = useStore();
  const { data: users, isPending } = useQuery({
    queryKey: [justClients ? "clients" : "users", globalSearchText],
    queryFn: async () => {
      const data = await actions.getUsers({
        searchText: globalSearchText || "",
        justClients,
      });
      return data?.data?.data || [];
    },
  });

  console.log({ users });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
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
                update("user", u);
                update("openDialog", "user");
                update("creating", false);
              }}
            >
              <TableCell>
                <img
                  src={"/avatar?id=" + u.id}
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </TableCell>
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

export default UsersTable;
