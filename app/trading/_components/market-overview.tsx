"use client";

import React from "react";

import { KlineIntervalSelection } from "./kline-interval-selection";
import ChartComponent from "./market-overview-chart";
import { SymbolSelection } from "./symbol-selection";
import SymbolTicker from "./symbol-ticker";

export default function MarketOverview() {
  return (
    <div className="bg-card rounded-lg p-6">
      <SymbolTicker />
      <SymbolSelection />
      <KlineIntervalSelection />
      <ChartComponent />
    </div>
  );
}
