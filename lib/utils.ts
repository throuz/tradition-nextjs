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
  decimalPlaces,
}: {
  orderSide: OrderSide;
  leverage: number;
  entryPrice: number;
  decimalPlaces: number;
}): number => {
  return orderSide === OrderSide.Buy
    ? Number((entryPrice * (1 - 1 / leverage)).toFixed(decimalPlaces))
    : Number((entryPrice * (1 + 1 / leverage)).toFixed(decimalPlaces));
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
  return side === OrderSide.Buy
    ? Number(((lastPrice - entryPrice) * size).toFixed(2))
    : Number(((lastPrice - entryPrice) * size * -1).toFixed(2));
};

export const formatWithSign = (value: number): string => {
  if (value > 0) {
    return `+${value}`;
  }
  return `${value}`;
};
