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
import { CircleDollarSign, Edit2Icon } from "lucide-react";
import { SaleCashflowsDialog } from "./SaleCashflowsDialog";
import { TableSkeletonComponent } from "./Skeletons";

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
  console.log({ sales });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Vehículo</TableHead>
          <TableHead className="min-w-24">Precio</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending ? (
          <TableSkeletonComponent />
        ) : (
          Array.isArray(sales) &&
          sales?.map((s) => (
            <TableRow key={s.id} className="cursor-pointer">
              <TableCell className="font-medium w-48">
                {`${s.user.firstname} ${s.user.lastname}`}
              </TableCell>
              <TableCell className="font-medium w-48">
                {`${s.vehicle.brand?.toUpperCase()} - ${s.vehicle.model}`}
              </TableCell>
              <TableCell className="w-48">
                {Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  maximumFractionDigits: 0,
                }).format(s.total_amount)}
              </TableCell>
              <TableCell className="flex gap-3">
                <Edit2Icon
                  className="h-5 w-5"
                  onClick={() => {
                    console.log("CLICK");
                    console.log({ s });
                    update("sale", {
                      id: s.id,
                      services: JSON.parse(s.services as string),
                      user: [
                        {
                          id: s.user.id,
                          name: `${s.user.firstname} ${s.user.lastname}`,
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
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default SalesTable;
