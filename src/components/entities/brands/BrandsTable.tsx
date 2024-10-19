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
import MyDropdown from "@/components/custom-ui/DropdownWhatsapp";
import { TableSkeletonComponent } from "@/components/custom-ui/Skeletons";

const BrandsTable = () => {
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
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
};

export default BrandsTable;
