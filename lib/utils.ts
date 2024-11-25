import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { OrderSide } from "./types";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (addr: string | undefined) => {
  return `${addr?.substring(0, 8)}...`;
};

export const calculateLiqPrice = ({
  orderSide,
  leverage,
  entryPrice,
}: {
  orderSide: OrderSide;
  leverage: number;
  entryPrice: number;
}): number | null => {
  if (orderSide === OrderSide.Buy) {
    return entryPrice * (1 - 1 / leverage);
  } else if (orderSide === OrderSide.Sell) {
    return entryPrice * (1 + 1 / leverage);
  }
  return null;
};

export const calculatePnl = ({
  lastPrice,
  entryPrice,
  size,
  side,
}: {
  lastPrice: number;
  entryPrice: number;
  size: number;
  side: OrderSide;
}): number => {
  return (lastPrice - entryPrice) * size * (side === OrderSide.Buy ? 1 : -1);
};
