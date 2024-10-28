import { useStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { format, addHours } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2Icon } from "lucide-react";
import { TableSkeletonComponent } from "../../custom-ui/Skeletons";
import { toMoney } from "@/helpers/fmt";

const SaleCashflowsTable = ({ sale_id }: { sale_id: number }) => {
  const { update, cashflow } = useStore();
  const { data: cashflows, isPending } = useQuery({
    queryKey: ["cashflows", sale_id],
    queryFn: async () => {
      const data = await actions.getCashflows({
        saleId: sale_id,
      });
      return data?.data?.data || [];
    },
  });
  console.log({ cashflows });

  if (cashflows?.length === 0)
    return (
      <span className="block text-center text-muted-foreground py-2 text-sm">
        Ningún cobro recibido
      </span>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Método</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>
            <span className="sr-only">Acciones</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending ? (
          <TableSkeletonComponent />
        ) : (
          Array.isArray(cashflows) &&
          cashflows?.map((c) => (
            <TableRow
              key={c.id}
              className={`cursor-pointer ${c.id === cashflow.id ? "bg-gray-100" : ""}`}
            >
              <TableCell className="flex w-28">{c.method}</TableCell>
              <TableCell>
                {format(
                  addHours(
                    new Date(c.created_at),
                    (new Date(c.created_at).getTimezoneOffset() / 60) * -1
                  ),
                  "dd MMM HH:mm",
                  {
                    locale: es,
                  }
                )}
              </TableCell>
              <TableCell className="w-24">{toMoney(c.amount)}</TableCell>
              <TableCell>
                <Edit2Icon
                  className={`h-4 w-4 ${c.id === cashflow.id ? "text-blue-500" : "text-gray-900"} hover:text-blue-500`}
                  onClick={() => {
                    update("cashflow", {
                      id: c.id,
                      method: [{ id: 1, name: c.method }],
                      sale_id: c.sale_id,
                      amount: c.amount,
                    });
                    update("creating", false);
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

export default SaleCashflowsTable;
