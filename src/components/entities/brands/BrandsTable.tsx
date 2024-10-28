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
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BrandsTable = () => {
  const { update, globalSearchText, deleting } = useStore();
  const {
    data: brands,
    isPending,
    refetch,
  } = useQuery({
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
                {deleting === `brand-${b.id}` ? (
                  <LoadingSpinner />
                ) : (
                  <Trash2
                    className="text-red-700 hover:text-red-500 hover:cursor-pointer"
                    onClick={async (e) => {
                      e.stopPropagation();
                      update("deleting", `brand-${b.id}`);
                      const result = await actions.deleteBrand(b.id);
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

export default BrandsTable;
