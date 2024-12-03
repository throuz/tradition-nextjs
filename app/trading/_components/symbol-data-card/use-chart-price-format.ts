import { DeepPartial } from "react-hook-form";
import { PriceFormat } from "lightweight-charts";
import { useSearchParams } from "next/navigation";

import { FilterType } from "@/lib/types";

import { useSymbolDataCardContext } from "./context";

export function useChartPriceFormat(): DeepPartial<PriceFormat> {
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");
  const { exchangeInfoResponse } = useSymbolDataCardContext();

  const chartPriceFormat: DeepPartial<PriceFormat> = (() => {
    const foundSymbolInfo = exchangeInfoResponse.symbols.find(
      (symbolInfo) => symbolInfo.symbol === symbol
    );

    const minMove = Number(
      foundSymbolInfo?.filters.find(
        (item) => item.filterType === FilterType.PriceFilter
      )?.tickSize
    );

    return { type: "price", minMove };
  })();

  return chartPriceFormat;
}
