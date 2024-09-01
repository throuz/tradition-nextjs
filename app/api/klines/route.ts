// app/api/klines/route.ts

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const interval = searchParams.get("interval");
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const limit = searchParams.get("limit") || "500";

  if (!symbol || !interval) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const url = new URL("https://fapi.binance.com/fapi/v1/klines");
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("interval", interval);
  url.searchParams.append("limit", limit);
  if (startTime) url.searchParams.append("startTime", startTime);
  if (endTime) url.searchParams.append("endTime", endTime);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
