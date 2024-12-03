import { create } from "zustand";
import { persist } from "zustand/middleware";

import { TradingMode } from "../types";

interface GlobalStore {
  tradingMode: TradingMode;
  updateTradingMode: (tradingMode: TradingMode) => void;
}

const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      tradingMode: TradingMode.Demo,
      updateTradingMode: (tradingMode: TradingMode) => set({ tradingMode }),
    }),
    {
      name: "global-storage",
    }
  )
);

export default useGlobalStore;
