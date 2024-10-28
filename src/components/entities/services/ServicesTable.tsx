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
import { LoadingSpinner } from "@/components/custom-ui/Spinner";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ServicesTable = () => {
  const { globalSearchText, update, deleting } = useStore();
  const {
    data: services,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["services", globalSearchText],
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
              onClick={() => {
                update("service", s);

                update("openDialog", "service");
                update("creating", false);
              }}
            >
              <TableCell className="font-medium w-48">{s.name}</TableCell>
              <TableCell className="w-48">{toMoney(s.price)}</TableCell>
              <TableCell>
                {deleting === `service-${s.id}` ? (
                  <LoadingSpinner />
                ) : (
                  <Trash2
                    className="text-red-700 hover:text-red-500 hover:cursor-pointer"
                    onClick={async (e) => {
                      e.stopPropagation();
                      update("deleting", `service-${s.id}`);
                      const result = await actions.deleteService(s.id);
                      update("deleting", "");
                      refetch();
                      toast({
                        title: "Operación exitosa",
                        description: result.data?.message,
                      });
                    }}
                  />
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ServicesTable;
