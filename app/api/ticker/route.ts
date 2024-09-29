import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  const baseUrl = "https://fapi.binance.com/fapi/v2/ticker/price";
  const url = symbol ? `${baseUrl}?symbol=${symbol}` : baseUrl;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch price data for symbol: ${symbol || "all symbols"}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching ticker price:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticker price information" },
      { status: 500 }
    );
  }
}
