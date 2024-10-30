import { Trash2 } from "lucide-react";
import { LoadingSpinner } from "./Spinner";
import { useStore } from "@/stores";
import { actions } from "astro:actions";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  id: number;
  entity: "User" | "Service" | "Brand" | "Vehicle";
  queryKey: string[];
}

const DeleteIcon = ({ id, entity, queryKey }: Props) => {
  const queryClient = useQueryClient();
  const deleting = useStore((s) => s.deleting);
  const update = useStore((s) => s.update);
  if (deleting === `${id}`) return <LoadingSpinner />;

  return (
    <Trash2
      className="text-red-700 hover:text-red-500 hover:cursor-pointer"
      onClick={async (e) => {
        e.stopPropagation();
        update("deleting", `${id}`);
        const result = await actions[`delete${entity}`](id);
        update("deleting", "");
        await queryClient.refetchQueries({ queryKey });
        toast({
          title: "Operación exitosa",
          description: result.data?.message,
        });
      }}
    />
  );
};

export default DeleteIcon;
