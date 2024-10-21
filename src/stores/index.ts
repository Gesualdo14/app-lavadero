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
  openDatePicker: string;
  openSelect: string;
  loading: string;
  searchText: string;
  globalSearchText: string;
  creating: boolean;
  sheetOpen: boolean;
  update: (prop: keyof Store, value: any) => void;
};

export const EMPTY_SALE = {
  sale_date: new Date().toUTCString(),
  services: [],
  client: [],
  vehicle: [],
  company_id: 1,
  gathered: 0,
  total_amount: 0,
};
export const EMPTY_USER = {
  id: 0,
  firstname: "",
  lastname: "",
  company_id: 1,
  email: "",
  brand: [],
  model: "",
  patent: "",
};

export const useStore = create<Store>((set) => ({
  user: EMPTY_USER,
  sale: EMPTY_SALE,
  cashflow: {
    sale_id: 0,
    method: [],
  },
  panel: "ventas",
  openDialog: "",
  openDatePicker: "",
  openSelect: "",
  loading: "",
  searchText: "",
  globalSearchText: "",
  creating: false,
  sheetOpen: false,
  update: (prop, value) =>
    set((state) => {
      if (prop === "panel") {
        localStorage.setItem(prop, value);
      }
      return { ...state, [prop]: value };
    }),
}));
