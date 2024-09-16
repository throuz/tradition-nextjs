import { createStore } from "zustand/vanilla";

import { KlineInterval } from "@/lib/types";

export type KlineState = {
  symbol: string;
  interval: KlineInterval;
};

export type KlineActions = {
  setSymbol: (symbol: string) => void;
  setInterval: (interval: KlineInterval) => void;
};

export type KlineStore = KlineState & KlineActions;

export const defaultKlineState: KlineState = {
  symbol: "BTCUSDT",
  interval: KlineInterval.OneDay,
};

export const createKlineStore = (initState: KlineState = defaultKlineState) => {
  return createStore<KlineStore>()((set) => ({
    ...initState,
    setSymbol: (symbol) => set(() => ({ symbol })),
    setInterval: (interval) => set(() => ({ interval })),
  }));
};
