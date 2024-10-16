"use client";

import React, { createContext, ReactNode, useContext } from "react";

import { ExchangeInfoResponse } from "@/lib/api/exchange-info";
import { KlinesResponse } from "@/lib/api/klines";

interface SymbolDataCardContextProps {
  klinesResponse: KlinesResponse;
  exchangeInfoResponse: ExchangeInfoResponse;
}

const SymbolDataCardContext = createContext<
  SymbolDataCardContextProps | undefined
>(undefined);

export const SymbolDataCardProvider = ({
  klinesResponse,
  exchangeInfoResponse,
  children,
}: {
  klinesResponse: KlinesResponse;
  exchangeInfoResponse: ExchangeInfoResponse;
  children: ReactNode;
}) => {
  return (
    <SymbolDataCardContext.Provider
      value={{ klinesResponse, exchangeInfoResponse }}
    >
      {children}
    </SymbolDataCardContext.Provider>
  );
};

export const useSymbolDataCardContext = () => {
  const context = useContext(SymbolDataCardContext);
  if (context === undefined) {
    throw new Error(
      "useSymbolDataCardContext must be used within a SymbolDataCardProvider"
    );
  }
  return context;
};
