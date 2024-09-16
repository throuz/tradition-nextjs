// app/api/exchange-info/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const url = new URL("https://fapi.binance.com/fapi/v1/exchangeInfo");

  try {
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Failed to fetch exchange info");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch exchange information" },
      { status: 500 }
    );
  }
}
