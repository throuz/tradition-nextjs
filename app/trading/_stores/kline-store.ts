import { TimeInterval } from "@/lib/types";
import { createStore } from "zustand/vanilla";

export type KlineState = {
  symbol: string;
  interval: TimeInterval;
};

export type KlineActions = {
  setSymbol: (symbol: string) => void;
  setInterval: (interval: TimeInterval) => void;
};

export type KlineStore = KlineState & KlineActions;

export const defaultKlineState: KlineState = {
  symbol: "BTCUSDT",
  interval: TimeInterval.OneDay,
};

export const createKlineStore = (initState: KlineState = defaultKlineState) => {
  return createStore<KlineStore>()((set) => ({
    ...initState,
    setSymbol: (symbol) => set(() => ({ symbol })),
    setInterval: (interval) => set(() => ({ interval })),
  }));
};
