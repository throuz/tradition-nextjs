"use client";

import React, { createContext, ReactNode, useContext } from "react";

import { ExchangeInfoResponse } from "@/lib/api/exchange-info";
import { KlinesResponse } from "@/lib/api/klines";
import { Ticker24hrResponse } from "@/lib/api/ticker24hr";

interface SymbolDataCardContextProps {
  klinesResponse: KlinesResponse;
  exchangeInfoResponse: ExchangeInfoResponse;
  ticker24hrResponse: Ticker24hrResponse;
}

const SymbolDataCardContext = createContext<
  SymbolDataCardContextProps | undefined
>(undefined);

export const SymbolDataCardProvider = ({
  klinesResponse,
  exchangeInfoResponse,
  ticker24hrResponse,
  children,
}: {
  klinesResponse: KlinesResponse;
  exchangeInfoResponse: ExchangeInfoResponse;
  ticker24hrResponse: Ticker24hrResponse;
  children: ReactNode;
}) => {
  return (
    <SymbolDataCardContext.Provider
      value={{ klinesResponse, exchangeInfoResponse, ticker24hrResponse }}
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
