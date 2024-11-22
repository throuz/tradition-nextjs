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
  updatePosition: (id: string, updates: Partial<Position>) => void;
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
        set({ positions: [...positions, position] });
      },
      closePosition: (id) => {
        const { positions } = get();
        set({
          positions: positions.filter((position) => position.id !== id),
        });
      },
      updatePosition: (id, updates) => {
        const { positions } = get();
        const positionIndex = positions.findIndex(
          (position) => position.id === id
        );
        if (positionIndex === -1) {
          console.error(`Position with id ${id} not found`);
          return;
        }
        const updatedPositions = positions.map((position) =>
          position.id === id ? { ...position, ...updates } : position
        );
        set({ positions: updatedPositions });
      },
      tradingMode: TradingMode.Demo,
      setTradingMode: (tradingMode) => set({ tradingMode }),
    }),
    {
      name: "global-storage",
    }
  )
);
