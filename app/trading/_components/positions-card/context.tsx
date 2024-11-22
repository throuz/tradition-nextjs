"use client";

import React, { createContext, ReactNode, useContext } from "react";

import { ExchangeInfoResponse } from "@/lib/api/exchange-info";

interface PositionsCardContextProps {
  exchangeInfoResponse: ExchangeInfoResponse;
}

const PositionsCardContext = createContext<
  PositionsCardContextProps | undefined
>(undefined);

export const PositionsCardProvider = ({
  exchangeInfoResponse,
  children,
}: {
  exchangeInfoResponse: ExchangeInfoResponse;
  children: ReactNode;
}) => {
  return (
    <PositionsCardContext.Provider value={{ exchangeInfoResponse }}>
      {children}
    </PositionsCardContext.Provider>
  );
};

export const usePositionsCardContext = () => {
  const context = useContext(PositionsCardContext);
  if (context === undefined) {
    throw new Error(
      "usePositionsCardContext must be used within a PositionsCardProvider"
    );
  }
  return context;
};
