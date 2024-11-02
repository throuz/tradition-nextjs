import { useSearchParams } from "next/navigation";

import { FilterType } from "@/lib/types";

import { usePlaceOrderCardContext } from "./context";

export function usePriceDecimalDigits() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");
  const { exchangeInfoResponse } = usePlaceOrderCardContext();

  const foundSymbolInfo = exchangeInfoResponse.symbols.find(
    (symbolInfo) => symbolInfo.symbol === symbol
  );

  const tickSize = foundSymbolInfo?.filters.find(
    (item) => item.filterType === FilterType.PriceFilter
  )?.tickSize;

  function getDecimalDigits(value: string | undefined): number {
    if (value && value.includes(".")) {
      const decimalPart = value.split(".")[1];
      return decimalPart.length;
    }
    return 0;
  }

  const digits = getDecimalDigits(tickSize);

  return digits;
}
