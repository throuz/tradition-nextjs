import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Position, TradingMode } from "../types";

interface GlobalStore {
  balance: number;
  updateBalance: (amount: number) => void;
  positions: Position[];
  createPosition: (position: Position) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  deletePosition: (id: string) => void;
  tradingMode: TradingMode;
  updateTradingMode: (tradingMode: TradingMode) => void;
}

const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      balance: 0,
      updateBalance: (amount: number) =>
        set((state) => ({
          balance: state.balance + amount,
        })),
      positions: [],
      createPosition: (position: Position) =>
        set((state) => ({
          positions: [...state.positions, position],
        })),
      updatePosition: (id: string, updates: Partial<Position>) =>
        set((state) => ({
          positions: state.positions.map((position) =>
            position.id === id ? { ...position, ...updates } : position
          ),
        })),
      deletePosition: (id: string) =>
        set((state) => ({
          positions: state.positions.filter((position) => position.id !== id),
        })),
      tradingMode: TradingMode.Demo,
      updateTradingMode: (tradingMode: TradingMode) => set({ tradingMode }),
    }),
    {
      name: "global-storage",
    }
  )
);

export default useGlobalStore;
