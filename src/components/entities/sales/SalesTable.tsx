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
import { CircleDollarSign, Edit2Icon } from "lucide-react";
import { TableSkeletonComponent } from "@/components/custom-ui/Skeletons";
import { Progress } from "@/components/ui/progress";

const SalesTable = () => {
  const { update, globalSearchText } = useStore();
  const { data: sales, isPending } = useQuery({
    queryKey: ["sales", globalSearchText],
    queryFn: async () => {
      const data = await actions.getSales({
        searchText: globalSearchText || "",
      });
      return data?.data?.data || [];
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-center">
          <TableHead>Cliente</TableHead>
          <TableHead className="hidden sm:flex items-center">
            Vehículo
          </TableHead>
          <TableHead className="min-w-24">Precio</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending ? (
          <TableSkeletonComponent />
        ) : (
          Array.isArray(sales) &&
          sales?.map((s) => (
            <TableRow key={s.id} className="cursor-pointer">
              <TableCell className="font-medium w-80">
                <div className="flex flex-col">
                  <span>{`${s.client.firstname} ${s.client.lastname}`}</span>
                  <span className="text-[12px] text-gray-400 block sm:hidden">{`${s.vehicle.brand?.toUpperCase()} - ${s.vehicle.model}`}</span>
                  <span className="text-[12px] text-gray-400 hidden sm:block">
                    {s.client.email}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:inline-block w-48">
                <div className="flex flex-col h-100">
                  <span>{s.vehicle.brand?.toUpperCase()}</span>
                  <span className="text-[12px] text-gray-400">
                    {s.vehicle.model}
                  </span>
                </div>
              </TableCell>
              <TableCell className="w-48">
                <div className="flex flex-col items-center w-16">
                  <span>
                    {Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      maximumFractionDigits: 0,
                    }).format(s.total_amount)}
                  </span>
                  <Progress
                    value={((s.gathered || 0) / s.total_amount) * 100}
                    className="!w-16 bg-white ring-[0.5px] ring-gray-300"
                    color="bg-red-300"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-start justify-start gap-3">
                  <Edit2Icon
                    className="h-5 w-5"
                    onClick={() => {
                      console.log("CLICK");
                      console.log({ s });
                      update("sale", {
                        id: s.id,
                        services: JSON.parse(s.services as string),
                        client: [
                          {
                            id: s.client.id,
                            name: `${s.client.firstname} ${s.client.lastname}`,
                          },
                        ],
                        vehicle: [
                          {
                            id: s.vehicle.id,
                            name: `${s.vehicle.brand} ${s.vehicle.model}`,
                          },
                        ],
                        total_amount: s.total_amount,
                      });
                      update("openDialog", "sale");
                      update("creating", false);
                    }}
                  />
                  <CircleDollarSign
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      update("creating", true);
                      update("openDialog", "cashflow");
                      update("sale", s);
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default SalesTable;
