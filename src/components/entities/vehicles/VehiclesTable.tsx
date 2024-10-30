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
import DeleteIcon from "@/components/custom-ui/DeleteIcon";
import { Button } from "@/components/ui/button";

const VehiclesTable = () => {
  const userId = useStore((s) => s.user.id);
  const update = useStore((s) => s.update);

  const { data: vehicles, isPending } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const data = await actions.getItems({
        filterId: userId,
        entity: "vehicle",
      });
      return data?.data?.data || [];
    },
  });

  console.log({ vehicles });
  if (vehicles?.length === 0)
    return (
      <div>
        <span className="block text-center text-muted-foreground mt-10 text-sm">
          Este cliente no posee ningún vehículo
        </span>
        <div className="flex justify-center items-center mt-7 ml-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              update("vehicle", {
                user_id: userId,
                brand: [],
                model: "",
                patent: "",
              });
              update("openDialog", "vehicle");
              update("creating", true);
            }}
          >
            Nuevo vehículo
          </Button>
        </div>
      </div>
    );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Marca y modelo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isPending ? (
            <TableSkeletonComponent columns={2} />
          ) : (
            vehicles?.map((v) => (
              <TableRow
                key={v.id}
                onClick={() => {
                  console.log("CLICK");
                  update("vehicle", v);
                  update("openDialog", "vehicle");
                  update("creating", false);
                }}
                className="hover:cursor-pointer"
              >
                <TableCell className="font-medium w-48">{v.name}</TableCell>
                <TableCell>
                  <DeleteIcon
                    id={v.id}
                    entity="Vehicle"
                    queryKey={["vehicles"]}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end items-center mt-7 ml-2">
        <Button
          size="sm"
          className="text-md hover:underline"
          onClick={() => {
            update("vehicle", {
              user_id: userId,
              brand: [],
              model: "",
              patent: "",
            });
            update("openDialog", "vehicle");
            update("creating", true);
          }}
        >
          Nuevo vehículo
        </Button>
      </div>
    </div>
  );
};

export default VehiclesTable;
