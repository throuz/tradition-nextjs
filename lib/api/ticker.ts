export interface TickerResponse {
  symbol: string; // Symbol (e.g., "BTCUSDT")
  price: string; // Latest price as a string
  time: number; // Timestamp of the response
}

export type TickerAllSymbolsResponse = TickerResponse[];

export const fetchTicker = async (
  symbol?: string
): Promise<TickerResponse | TickerAllSymbolsResponse> => {
  const url = symbol
    ? `https://fapi.binance.com/fapi/v2/ticker/price?symbol=${symbol}`
    : `https://fapi.binance.com/fapi/v2/ticker/price`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch ticker");
  return response.json();
};
