import { useStore, type Store } from "@/stores";
import type { HTMLInputTypeAttribute } from "react";
import { Input } from "../ui/input";

interface Props<E extends keyof Store> {
  id?: string | number | undefined;
  type?: HTMLInputTypeAttribute;
  entity: E;
  field: keyof Store[E];
  placeholder?: string;
}
const MyInput = <E extends keyof Store>({
  id,
  type = "text",
  entity,
  field,
  placeholder,
}: Props<E>) => {
  const value = useStore((s) => s[entity][field]) as string;
  const update = useStore((s) => s.update);
  return (
    <Input
      id={String(id)}
      name={field as string}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => {
        console.log({ value: e.target.value });
        const value = e.target.value === "" ? "" : +e.target.value;
        update(entity, {
          [field]: type === "number" ? value : e.target.value,
        });
      }}
    />
  );
};

export default MyInput;
