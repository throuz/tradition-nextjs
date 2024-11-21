import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { OrderSide } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function calculateLiqPrice({
  orderSide,
  leverage,
  entryPrice,
}: {
  orderSide: OrderSide;
  leverage: number;
  entryPrice: number;
}): number | null {
  if (leverage <= 0 || entryPrice <= 0) {
    throw new Error("Leverage and entry price must be positive.");
  }

  if (orderSide === OrderSide.Buy) {
    return entryPrice * (1 - 1 / leverage);
  } else if (orderSide === OrderSide.Sell) {
    return entryPrice * (1 + 1 / leverage);
  }

  return null;
}
