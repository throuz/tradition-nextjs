"use client";

import React, { useState } from "react";
import ChartComponent from "./market-overview-chart";
import TimeIntervalDropdown from "./time-interval-dropdown";
import { TimeIntervalSelection } from "./time-interval-selection";
import { SymbolSelection } from "./symbol-selection";
import { TimeInterval } from "@/lib/types";
import { useKlineStore } from "../_providers/kline-store-providers";

const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT"]; // Updated format

export default function MarketOverview() {
  const { symbol, interval, setSymbol, setInterval } = useKlineStore(
    (state) => state
  );

  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">BTC/USD</h2>
      <div className="text-4xl font-bold mb-2">$42,000</div>
      <p className="text-muted-foreground">24h Change: +3.25%</p>
      <SymbolSelection
        symbols={symbols}
        selectedSymbol={symbol}
        onSelectSymbol={setSymbol}
      />
      <TimeIntervalSelection
        selectedInterval={interval}
        onSelectInterval={setInterval}
      />
      <TimeIntervalDropdown />
      <ChartComponent />
    </div>
  );
}
