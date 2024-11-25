import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Position, TradingMode } from "../types";

export type GlobalStore = {
  availableBalance: number;
  updateBalance: (amount: number) => void;
  positions: Position[];
  openPosition: (position: Position) => void;
  closePosition: (id: string) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  tradingMode: TradingMode;
  setTradingMode: (tradingMode: TradingMode) => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      availableBalance: 0,
      updateBalance: (amount: number) =>
        set((state) => ({
          availableBalance: state.availableBalance + amount,
        })),
      positions: [],
      openPosition: (position: Position) =>
        set((state) => ({
          positions: [...state.positions, position],
        })),
      closePosition: (id: string) =>
        set((state) => ({
          positions: state.positions.filter((position) => position.id !== id),
        })),
      updatePosition: (id: string, updates: Partial<Position>) =>
        set((state) => ({
          positions: state.positions.map((position) =>
            position.id === id ? { ...position, ...updates } : position
          ),
        })),
      tradingMode: TradingMode.Demo,
      setTradingMode: (tradingMode: TradingMode) => set({ tradingMode }),
    }),
    {
      name: "global-storage",
    }
  )
);
