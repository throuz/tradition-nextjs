import { NextRequest, NextResponse } from "next/server";

import { KlineInterval } from "./lib/types";

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  if (nextUrl.pathname === "/trading") {
    const hasSymbol = nextUrl.searchParams.has("symbol");
    const hasInterval = nextUrl.searchParams.has("interval");
    if (!hasSymbol) {
      nextUrl.searchParams.set("symbol", "BTCUSDT");
    }
    if (!hasInterval) {
      nextUrl.searchParams.set("interval", KlineInterval.OneDay);
    }
    if (!hasSymbol || !hasInterval) {
      return NextResponse.redirect(nextUrl);
    }
  }
  return NextResponse.next();
}
