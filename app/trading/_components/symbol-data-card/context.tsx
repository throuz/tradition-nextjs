"use client";

import React, { createContext, ReactNode, useContext } from "react";

import { ExchangeInfoResponse } from "@/lib/api/exchange-info";
import { KlinesResponse } from "@/lib/api/klines";
import {
  Ticker24hrAllSymbolsResponse,
  Ticker24hrResponse,
} from "@/lib/api/ticker24hr";

interface SymbolDataCardContextProps {
  klinesResponse: KlinesResponse;
  exchangeInfoResponse: ExchangeInfoResponse;
  ticker24hrResponse: Ticker24hrResponse;
  ticker24hrAllSymbolsResponse: Ticker24hrAllSymbolsResponse;
}

const SymbolDataCardContext = createContext<
  SymbolDataCardContextProps | undefined
>(undefined);

export const SymbolDataCardProvider = ({
  klinesResponse,
  exchangeInfoResponse,
  ticker24hrResponse,
  ticker24hrAllSymbolsResponse,
  children,
}: {
  klinesResponse: KlinesResponse;
  exchangeInfoResponse: ExchangeInfoResponse;
  ticker24hrResponse: Ticker24hrResponse;
  ticker24hrAllSymbolsResponse: Ticker24hrAllSymbolsResponse;
  children: ReactNode;
}) => {
  return (
    <SymbolDataCardContext.Provider
      value={{
        klinesResponse,
        exchangeInfoResponse,
        ticker24hrResponse,
        ticker24hrAllSymbolsResponse,
      }}
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
