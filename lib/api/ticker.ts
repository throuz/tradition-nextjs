export interface TickerResponse {
  symbol: string; // Symbol (e.g., "BTCUSDT")
  price: string; // Latest price as a string
  time: number; // Timestamp of the response
}

export type AllTickersResponse = TickerResponse[];

export async function fetchTicker(symbol: string): Promise<TickerResponse> {
  const response = await fetch(
    `https://fapi.binance.com/fapi/v2/ticker/price?symbol=${symbol}`,
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error("Failed to fetch ticker");
  return response.json();
}

export async function fetchAllTickers(): Promise<AllTickersResponse> {
  const response = await fetch(
    `https://fapi.binance.com/fapi/v2/ticker/price`,
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error("Failed to fetch all tickers");
  return response.json();
}
