import { DeepPartial, PriceFormat } from "lightweight-charts";
import { useMemo } from "react";

import { useExchangeInfoQuery } from "@/app/api/exchange-info/hooks";
import { FilterType } from "@/lib/types";

import { useKlineStore } from "../_providers/kline-store-providers";

function getDecimalDigits(value: string | undefined): number {
  if (value && value.includes(".")) {
    const decimalPart = value.split(".")[1];
    return decimalPart.length;
  }
  return 0;
}

export const usePriceDecimalDigits = () => {
  const symbol = useKlineStore((state) => state.symbol);
  const { data, isSuccess } = useExchangeInfoQuery();

  const digits = useMemo<number>(() => {
    if (isSuccess) {
      const foundSymbolInfo = data.symbols.find(
        (symbolInfo) => symbolInfo.symbol === symbol
      );
      const tickSize = foundSymbolInfo?.filters.find(
        (item) => item.filterType === FilterType.PriceFilter
      )?.tickSize;
      return getDecimalDigits(tickSize);
    }
    return 0;
  }, [data, isSuccess, symbol]);

  return digits;
};
