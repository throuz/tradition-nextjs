"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KlineInterval } from "@/lib/types";

const timeIntervals: KlineInterval[] = [
  KlineInterval.OneMinute,
  KlineInterval.ThreeMinutes,
  KlineInterval.FiveMinutes,
  KlineInterval.FifteenMinutes,
  KlineInterval.ThirtyMinutes,
  KlineInterval.OneHour,
  KlineInterval.TwoHours,
  KlineInterval.FourHours,
  KlineInterval.SixHours,
  KlineInterval.EightHours,
  KlineInterval.TwelveHours,
  KlineInterval.OneDay,
  KlineInterval.ThreeDays,
  KlineInterval.OneWeek,
  KlineInterval.OneMonth,
];

interface TimeIntervalDropdownProps {}

export default function TimeIntervalDropdown() {
  const [selectedInterval, setSelectedInterval] = useState<KlineInterval>(
    KlineInterval.OneDay
  );

  const handleTimeIntervalChange = (interval: KlineInterval) => {
    setSelectedInterval(interval);
    // Implement logic to update the chart based on the selected interval if needed
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent border border-gray-500 hover:bg-gray-700"
        >
          {selectedInterval}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {timeIntervals.map((interval) => (
          <DropdownMenuItem
            key={interval}
            className="cursor-pointer text-center"
            onClick={() => handleTimeIntervalChange(interval)}
          >
            {interval}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
