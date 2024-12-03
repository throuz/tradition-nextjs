import { useSymbolDataCardContext } from "./context";

interface Symbol {
  symbol: string;
  quoteVolume: number;
  priceChangePercent: string;
}

export function useSymbols(): Symbol[] {
  const { exchangeInfoResponse, ticker24hrAllSymbolsResponse } =
    useSymbolDataCardContext();

  const tickerMap = (() => {
    const map: Record<
      string,
      { quoteVolume: number; priceChangePercent: string }
    > = {};
    ticker24hrAllSymbolsResponse.forEach((ticker) => {
      const priceChangePercent = parseFloat(ticker.priceChangePercent);
      map[ticker.symbol] = {
        quoteVolume: parseFloat(ticker.quoteVolume),
        priceChangePercent: isNaN(priceChangePercent)
          ? "0%"
          : `${priceChangePercent >= 0 ? "+" : ""}${priceChangePercent}%`,
      };
    });
    return map;
  })();

  const symbols = (() => {
    return exchangeInfoResponse.symbols
      .filter(
        (symbolInfo) =>
          symbolInfo.contractType === "PERPETUAL" &&
          symbolInfo.status === "TRADING" &&
          symbolInfo.quoteAsset === "USDT"
      )
      .map((symbolInfo) => ({
        symbol: symbolInfo.symbol,
        quoteVolume: tickerMap[symbolInfo.symbol]?.quoteVolume || 0,
        priceChangePercent:
          tickerMap[symbolInfo.symbol]?.priceChangePercent || "0%",
      }))
      .sort((a, b) => b.quoteVolume - a.quoteVolume);
  })();

  return symbols;
}
