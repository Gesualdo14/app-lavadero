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
  const { data: brands, isPending } = useQuery({
    queryKey: ["brands", globalSearchText],
    queryFn: async () => {
      const data = await actions.getBrands({
        searchText: globalSearchText || "",
      });
      return data?.data?.data || [];
    },
  });

  console.log({ brands });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Denominación</TableHead>
          <TableHead>
            <span className="sr-only">Acciones</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      {isPending ? (
        <TableSkeletonComponent />
      ) : (
        <TableBody>
          {brands?.map((b) => (
            <TableRow>
              <TableCell className="font-medium w-48">{b.name}</TableCell>
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
