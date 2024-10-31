import type { Brand } from "@/schemas/brand";
import type { Cashflow } from "@/schemas/cashflow";
import type { Sale } from "@/schemas/sale";
import type { Service } from "@/schemas/service";
import type { User } from "@/schemas/user";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Store = {
  user: User;
  vehicle: {
    brand: [{ id: number; name: string }] | [];
    model: string;
    patent: string;
    user_id: number;
  };
  brand: Brand;
  service: Service;
  sale: Sale;
  filter: { date: string };
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
  id: undefined,
  company_id: 1,
  name: "",
};
export const EMPTY_SERVICE = {
  name: "",
  price: 0,
  company_id: 1,
};

export const useStore = create<Store>()(
  devtools((set) => ({
    user: EMPTY_USER,
    sale: EMPTY_SALE,
    vehicle: {
      brand: [],
      model: "",
      patent: "",
      user_id: 0,
    },
    service: EMPTY_SERVICE,
    brand: EMPTY_BRAND,
    cashflow: {
      sale_id: 0,
      method: [],
    },
    filter: { date: new Date().toUTCString() },
    panel: "ventas",
    openDialog: "",
    deleting: "",
    openDatePicker: "",
    openSelect: "",
    loading: "",
    filterDate: "",
    searchText: "",
    globalSearchText: "",
    creating: false,
    sheetOpen: false,
    update: (prop, value) =>
      set((state) => {
        if (prop === "panel") {
          localStorage.setItem(prop, value);
        }
        if (
          [
            "user",
            "sale",
            "vehicle",
            "service",
            "cashflow",
            "brand",
            "filter",
          ].includes(prop)
        ) {
          const currState = state[prop] as object;
          return { ...state, [prop]: { ...currState, ...value } };
        } else {
          return { ...state, [prop]: value };
        }
      }),
  }))
);
