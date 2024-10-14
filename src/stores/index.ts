import type { Cashflow } from "@/schemas/cashflow";
import type { Sale } from "@/schemas/sale";
import type { User } from "@/schemas/user";
import { create } from "zustand";

type Store = {
  user: User;
  sale: Sale;
  cashflow: Cashflow;
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
    gathered: 0,
    total_amount: 0,
  },
  cashflow: {
    id: 0,
    sale_id: 0,
    amount: 0,
    method: [],
  },
  openDialog: "",
  openSelect: "",
  searchText: "",
  globalSearchText: "",
  creating: false,
  update: (prop, value) => set((state) => ({ ...state, [prop]: value })),
}));
