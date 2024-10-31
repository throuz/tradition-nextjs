import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Position, TradingMode } from "../types";

export type GlobalStore = {
  positions: Position[];
  setPositions: (positions: Position[]) => void;
  tradingMode: TradingMode;
  setTradingMode: (tradingMode: TradingMode) => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      positions: [],
      setPositions: (positions) => set({ positions }),
      tradingMode: TradingMode.Demo,
      setTradingMode: (tradingMode) => set({ tradingMode }),
    }),
    {
      name: "global-storage",
    }
  )
);
