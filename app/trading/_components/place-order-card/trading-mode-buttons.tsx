"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/lib/hooks/useGlobalStore";
import { TradingMode } from "@/lib/types";

export function TradingModeButtons() {
  const { tradingMode, setTradingMode } = useGlobalStore();

  const modes = [
    { label: "Real", value: TradingMode.Real },
    { label: "Demo", value: TradingMode.Demo },
  ];

  return (
    <div className="flex space-x-2">
      {modes.map(({ label, value }) => (
        <Button
          key={value}
          type="button"
          variant={tradingMode === value ? "default" : "secondary"}
          onClick={() => setTradingMode(value)}
          aria-pressed={tradingMode === value}
          className="w-full"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}