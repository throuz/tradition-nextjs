"use client";

import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { KlineChart } from "./kline-chart";
import { KlineIntervalCombobox } from "./kline-interval-combobox";
import { SymbolTicker } from "./symbol-ticker";

export default function SymbolDataCard() {
  return (
    <Card>
      <CardHeader>
        <SymbolTicker />
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <KlineIntervalCombobox />
        </div>
        <KlineChart />
      </CardContent>
    </Card>
  );
}
