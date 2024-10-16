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
import { TableSkeletonComponent } from "./table-skeleton";

const UsersTable = () => {
  const { update, globalSearchText } = useStore();
  const { data: services, isPending } = useQuery({
    queryKey: ["services", globalSearchText],
    queryFn: async () => {
      const data = await actions.getServices({
        searchText: globalSearchText || "",
      });
      return data?.data?.data || [];
    },
  });

  console.log({ services });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Denominación</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>
            <span className="sr-only">Acciones</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      {isPending ? (
        <TableSkeletonComponent />
      ) : (
        <TableBody>
          {services?.map((s) => (
            <TableRow>
              <TableCell className="font-medium w-48">{s.name}</TableCell>
              <TableCell className="w-48">
                {Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  maximumFractionDigits: 0,
                }).format(s.price)}
              </TableCell>
              <TableCell>
                <MyDropdown />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
};

export default UsersTable;
