import type { User } from "@/schemas/user";
import { create } from "zustand";

type Store = {
  user: User;
  openDialog: string;
  creating: boolean;
  update: (prop: string, value: any) => void;
};

export const useStore = create<Store>((set) => ({
  user: {
    id: 0,
    firstname: "",
    lastname: "",
    email: "",
    brand: [],
    model: "",
    patent: "",
  },
  openDialog: "",
  creating: false,
  update: (prop, value) => set((state) => ({ ...state, [prop]: value })),
}));
