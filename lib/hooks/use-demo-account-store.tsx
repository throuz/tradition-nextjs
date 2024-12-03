import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Position } from "../types";

interface DemoAccountStore {
  balance: number;
  updateBalance: (amount: number) => void;
  positions: Position[];
  createPosition: (position: Position) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  deletePosition: (id: string) => void;
}

const useDemoAccountStore = create<DemoAccountStore>()(
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
    }),
    {
      name: "demo-account-storage",
    }
  )
);

export default useDemoAccountStore;
