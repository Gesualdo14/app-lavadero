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
import { toMoney } from "@/helpers/fmt";

const ServicesTable = () => {
  const { globalSearchText } = useStore();
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
      <TableBody>
        {isPending ? (
          <TableSkeletonComponent />
        ) : (
          services?.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium w-48">{s.name}</TableCell>
              <TableCell className="w-48">{toMoney(s.price)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ServicesTable;
