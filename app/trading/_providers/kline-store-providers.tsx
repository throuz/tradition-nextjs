"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

import { createKlineStore, type KlineStore } from "../_stores/kline-store";

export type KlineStoreApi = ReturnType<typeof createKlineStore>;

export const KlineStoreContext = createContext<KlineStoreApi | undefined>(
  undefined
);

export interface KlineStoreProviderProps {
  children: ReactNode;
}

export const KlineStoreProvider = ({ children }: KlineStoreProviderProps) => {
  const storeRef = useRef<KlineStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createKlineStore();
  }

  return (
    <KlineStoreContext.Provider value={storeRef.current}>
      {children}
    </KlineStoreContext.Provider>
  );
};

export const useKlineStore = <T, >(selector: (store: KlineStore) => T): T => {
  const klineStoreContext = useContext(KlineStoreContext);

  if (!klineStoreContext) {
    throw new Error(`useKlineStore must be used within KlineStoreProvider`);
  }

  return useStore(klineStoreContext, selector);
};
