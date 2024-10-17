import type { Cashflow } from "@/schemas/cashflow";
import type { Sale } from "@/schemas/sale";
import type { User } from "@/schemas/user";
import { create } from "zustand";

type Store = {
  user: User;
  sale: Sale;
  panel: string;
  cashflow: Partial<Cashflow>;
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
    company_id: 1,
    email: "",
    brand: [],
    model: "",
    patent: "",
  },
  sale: {
    services: [],
    client: [],
    vehicle: [],
    company_id: 1,
    gathered: 0,
    total_amount: 0,
  },
  cashflow: {
    sale_id: 0,
    method: [],
  },
  panel: "",
  openDialog: "",
  openSelect: "",
  searchText: "",
  globalSearchText: "",
  creating: false,
  update: (prop, value) =>
    set((state) => {
      if (prop === "panel") {
        localStorage.setItem(prop, value);
      }
      return { ...state, [prop]: value };
    }),
}));
