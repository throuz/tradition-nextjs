import { DeepPartial, PriceFormat } from "lightweight-charts";
import { useMemo } from "react";

import { useExchangeInfoQuery } from "@/app/api/exchange-info/hooks";
import { FilterType } from "@/lib/types";

import { useKlineStore } from "../_providers/kline-store-providers";

const getDecimalPrecision = (value: number): number => {
  const valueStr = value.toString();
  const decimalIndex = valueStr.indexOf(".");
  if (decimalIndex === -1) return 0;
  return valueStr.length - decimalIndex - 1;
};

export const useChartPriceFormat = () => {
  const symbol = useKlineStore((state) => state.symbol);
  const { data, isSuccess } = useExchangeInfoQuery();

  const chartPriceFormat = useMemo<DeepPartial<PriceFormat>>(() => {
    if (isSuccess) {
      const foundSymbolInfo = data.symbols.find(
        (symbolInfo) => symbolInfo.symbol === symbol
      );
      const minMove = Number(
        foundSymbolInfo?.filters.find(
          (item) => item.filterType === FilterType.PriceFilter
        )?.tickSize
      );
      const precision = getDecimalPrecision(minMove);
      return { type: "price", precision, minMove };
    }
    return {};
  }, [data, isSuccess, symbol]);

  return chartPriceFormat;
};
