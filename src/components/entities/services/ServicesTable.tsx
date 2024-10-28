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
import { toMoney } from "@/helpers/fmt";
import DeleteIcon from "@/components/custom-ui/DeleteIcon";

const ServicesTable = () => {
  const globalSearchText = useStore((s) => s.globalSearchText);

  const update = useStore((s) => s.update);
  const queryKey = ["services", globalSearchText];
  const { data: services, isPending } = useQuery({
    queryKey,
    queryFn: async () => {
      const data = await actions.getServices({
        searchText: globalSearchText || "",
      });
      return data?.data?.data || [];
    },
  });

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
            <TableRow
              key={s.id}
              className="hover:cursor-pointer"
              onClick={() => {
                update("service", {
                  id: s.id,
                  name: s.name,
                  price: s.price,
                });
                update("openDialog", "service");
                update("creating", false);
              }}
            >
              <TableCell className="font-medium w-48">{s.name}</TableCell>
              <TableCell className="w-48">{toMoney(s.price)}</TableCell>
              <TableCell>
                <DeleteIcon id={s.id} entity="Service" queryKey={queryKey} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ServicesTable;
