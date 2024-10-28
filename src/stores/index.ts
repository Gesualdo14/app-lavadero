import type { Brand } from "@/schemas/brand";
import type { Cashflow } from "@/schemas/cashflow";
import type { Sale } from "@/schemas/sale";
import type { Service } from "@/schemas/service";
import type { User } from "@/schemas/user";
import { create } from "zustand";

type Store = {
  user: User;
  brand: Partial<Brand>;
  service: Partial<Service>;
  sale: Sale;
  panel: string;
  cashflow: Partial<Cashflow>;
  openDialog: string;
  openDatePicker: string;
  deleting: string;
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
  company_id: 1,
  firstname: "",
  lastname: "",
  email: "",
  brand: [],
  model: "",
  patent: "",
};
export const EMPTY_BRAND = {
  name: "",
};
export const EMPTY_SERVICE = {
  name: "",
  price: 0,
};

export const useStore = create<Store>((set) => ({
  user: EMPTY_USER,
  sale: EMPTY_SALE,
  brand: EMPTY_BRAND,
  service: EMPTY_SERVICE,
  cashflow: {
    sale_id: 0,
    method: [],
  },
  panel: "ventas",
  openDialog: "",
  deleting: "",
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
