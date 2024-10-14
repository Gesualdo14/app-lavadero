import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useStore } from "@/stores/user";

const MySearchBar = () => {
  const { update } = useStore();
  return (
    <div className="relative  flex-1 w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <form
        onSubmit={(e) => {
          update(
            "globalSearchText",
            (document.getElementById("input") as HTMLInputElement).value
          );
        }}
      >
        <Input
          id="input"
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8"
        />
        <button type="submit" className="hidden"></button>
      </form>
    </div>
  );
};

export default MySearchBar;
