import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  const baseUrl = "https://fapi.binance.com/fapi/v1/premiumIndex";
  const url = symbol ? `${baseUrl}?symbol=${symbol}` : baseUrl;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch mark price data for symbol: ${symbol || "all symbols"}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch mark price information" },
      { status: 500 }
    );
  }
}
