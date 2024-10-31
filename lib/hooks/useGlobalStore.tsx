import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum TradingMode {
  Real = "REAL",
  Demo = "DEMO",
}

export type GlobalStore = {
  bears: number;
  addABear: () => void;
  userData: Record<string, any> | null;
  setUserData: (data: Record<string, any>) => void;
  tradingMode: TradingMode;
  setTradingMode: (mode: TradingMode) => void;
  resetStore: () => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
      userData: null,
      setUserData: (data) => set({ userData: data }),
      tradingMode: TradingMode.Demo,
      setTradingMode: (mode) => set({ tradingMode: mode }),
      resetStore: () =>
        set({ bears: 0, userData: null, tradingMode: TradingMode.Demo }),
    }),
    {
      name: "global-storage",
    }
  )
);
