"use client";

import React, { createContext, ReactNode, useContext } from "react";

import { ExchangeInfoResponse } from "@/lib/api/exchange-info";

interface PlaceOrderCardContextProps {
  exchangeInfoResponse: ExchangeInfoResponse;
}

const PlaceOrderCardContext = createContext<
  PlaceOrderCardContextProps | undefined
>(undefined);

export const PlaceOrderCardProvider = ({
  exchangeInfoResponse,
  children,
}: {
  exchangeInfoResponse: ExchangeInfoResponse;
  children: ReactNode;
}) => {
  return (
    <PlaceOrderCardContext.Provider value={{ exchangeInfoResponse }}>
      {children}
    </PlaceOrderCardContext.Provider>
  );
};

export const usePlaceOrderCardContext = () => {
  const context = useContext(PlaceOrderCardContext);
  if (context === undefined) {
    throw new Error(
      "usePlaceOrderCardContext must be used within a PlaceOrderCardProvider"
    );
  }
  return context;
};
