import { useMemo } from "react";
import { useExchangeInfoQuery } from "../../api/exchange-info/hooks";

export const useSymbols = () => {
  const { data, isSuccess } = useExchangeInfoQuery();

  const symbols = useMemo(() => {
    if (isSuccess) {
      return data.symbols
        .filter(
          (symbolInfo) =>
            symbolInfo.contractType === "PERPETUAL" &&
            symbolInfo.status === "TRADING" &&
            symbolInfo.quoteAsset === "USDT"
        )
        .map((symbolInfo) => symbolInfo.symbol);
    }
    return [];
  }, [data, isSuccess]);

  return symbols;
};
