"use client";

import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { KlineIntervalSelection } from "./kline-interval-selection";
import ChartComponent from "./market-overview-chart";
import SymbolTicker from "./symbol-ticker";

export default function SymbolDataDisplay() {
  return (
    <Card>
      <CardHeader>
        <SymbolTicker />
      </CardHeader>
      <CardContent>
        <KlineIntervalSelection />
        <ChartComponent />
      </CardContent>
    </Card>
  );
}
