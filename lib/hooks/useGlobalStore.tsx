import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Position, TradingMode } from "../types";

export type GlobalStore = {
  positions: Position[];
  openPosition: (position: Position) => void;
  closePosition: (id: string) => void;
  tradingMode: TradingMode;
  setTradingMode: (tradingMode: TradingMode) => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      positions: [],
      openPosition: (position) =>
        set({ positions: [...get().positions, position] }),
      closePosition: (id) => {
        const positions = get().positions;
        const index = positions.findIndex((position) => position.id === id);
        if (index !== -1) {
          positions.splice(index, 1);
          set({ positions });
        }
      },
      tradingMode: TradingMode.Demo,
      setTradingMode: (tradingMode) => set({ tradingMode }),
    }),
    {
      name: "global-storage",
    }
  )
);
