import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Position, TradingMode } from "../types";

export type GlobalStore = {
  availableBalance: number;
  increaseAvailableBalance: (increaseAmount: number) => void;
  decreaseAvailableBalance: (decreaseAmount: number) => void;
  positions: Position[];
  openPosition: (position: Position) => void;
  closePosition: (id: string) => void;
  tradingMode: TradingMode;
  setTradingMode: (tradingMode: TradingMode) => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      availableBalance: 0,
      increaseAvailableBalance: (increaseAmount) => {
        const { availableBalance } = get();
        set({ availableBalance: availableBalance + increaseAmount });
      },
      decreaseAvailableBalance: (decreaseAmount) => {
        const { availableBalance } = get();
        set({ availableBalance: availableBalance - decreaseAmount });
      },
      positions: [],
      openPosition: (position) => {
        const { positions } = get();
        positions.push(position);
        set({ positions });
      },
      closePosition: (id) => {
        const { positions } = get();
        const index = positions.findIndex((position) => position.id === id);
        if (index !== -1) {
          positions.splice(index, 1);
        }
        set({ positions });
      },
      tradingMode: TradingMode.Demo,
      setTradingMode: (tradingMode) => set({ tradingMode }),
    }),
    {
      name: "global-storage",
    }
  )
);
