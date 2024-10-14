import type { Sale } from "@/schemas/sale";
import type { User } from "@/schemas/user";
import { create } from "zustand";

type Store = {
  user: User;
  sale: Sale;
  openDialog: string;
  openSelect: string;
  searchText: string;
  globalSearchText: string;
  creating: boolean;
  update: (prop: keyof Store, value: any) => void;
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
  sale: {
    services: [],
    user: [],
    vehicle: [],
    total_amount: 0,
  },
  openDialog: "",
  openSelect: "",
  searchText: "",
  globalSearchText: "",
  creating: false,
  update: (prop, value) => set((state) => ({ ...state, [prop]: value })),
}));
