export interface Ticker24hrResponse {
  symbol: string; // Symbol (e.g., "BTCUSDT")
  priceChange: string; // Price change in the last 24 hours
  priceChangePercent: string; // Price change percentage
  weightedAvgPrice: string; // Weighted average price
  lastPrice: string; // Last price
  lastQty: string; // Last quantity
  openPrice: string; // Open price
  highPrice: string; // High price
  lowPrice: string; // Low price
  volume: string; // Volume in the last 24 hours
  quoteVolume: string; // Quote volume in the last 24 hours
  openTime: number; // Open time (timestamp)
  closeTime: number; // Close time (timestamp)
  firstId: number; // First trade ID
  lastId: number; // Last trade ID
  count: number; // Trade count
}

export type Ticker24hrAllSymbolsResponse = Ticker24hrResponse[];

export const fetchTicker24hr = async (
  symbol?: string
): Promise<Ticker24hrResponse | Ticker24hrAllSymbolsResponse> => {
  const url = symbol
    ? `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`
    : `https://fapi.binance.com/fapi/v1/ticker/24hr`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch 24hr ticker");
  return response.json();
};
