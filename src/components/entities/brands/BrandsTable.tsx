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
import { LoadingSpinner } from "@/components/custom-ui/Spinner";
import { Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DeleteIcon from "@/components/custom-ui/DeleteIcon";

const BrandsTable = () => {
  const update = useStore((s) => s.update);
  const globalSearchText = useStore((s) => s.globalSearchText);
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
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending ? (
          <TableSkeletonComponent columns={2} />
        ) : (
          brands?.map((b) => (
            <TableRow
              key={b.id}
              onClick={() => {
                console.log("CLICK");
                update("brand", b);
                update("openDialog", "brand");
                update("creating", false);
              }}
              className="hover:cursor-pointer"
            >
              <TableCell className="font-medium w-48">{b.name}</TableCell>
              <TableCell>
                <DeleteIcon
                  id={b.id}
                  entity="Brand"
                  queryKey={["brands", globalSearchText]}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default BrandsTable;
