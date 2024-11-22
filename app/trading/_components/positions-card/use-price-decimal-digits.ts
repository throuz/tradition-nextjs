import { FilterType } from "@/lib/types";

import { usePositionsCardContext } from "./context";

const usePriceDecimalDigits = (symbol: string) => {
  const { exchangeInfoResponse } = usePositionsCardContext();

  const foundSymbolInfo = exchangeInfoResponse.symbols.find(
    (symbolInfo) => symbolInfo.symbol === symbol
  );

  const tickSize = foundSymbolInfo?.filters.find(
    (item) => item.filterType === FilterType.PriceFilter
  )?.tickSize;

  const getDecimalDigits = (value: string | undefined): number => {
    if (value && value.includes(".")) {
      const decimalPart = value.split(".")[1];
      return decimalPart.length;
    }
    return 0;
  };

  const digits = getDecimalDigits(tickSize);

  return digits;
};

export default usePriceDecimalDigits;
