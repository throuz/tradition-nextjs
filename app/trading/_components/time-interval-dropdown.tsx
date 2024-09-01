"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TimeInterval } from "../_types";

const timeIntervals: TimeInterval[] = [
  TimeInterval.OneMinute,
  TimeInterval.ThreeMinutes,
  TimeInterval.FiveMinutes,
  TimeInterval.FifteenMinutes,
  TimeInterval.ThirtyMinutes,
  TimeInterval.OneHour,
  TimeInterval.TwoHours,
  TimeInterval.FourHours,
  TimeInterval.SixHours,
  TimeInterval.EightHours,
  TimeInterval.TwelveHours,
  TimeInterval.OneDay,
  TimeInterval.ThreeDays,
  TimeInterval.OneWeek,
  TimeInterval.OneMonth,
];

interface TimeIntervalDropdownProps {}

export default function TimeIntervalDropdown() {
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>(
    TimeInterval.OneDay
  );

  const handleTimeIntervalChange = (interval: TimeInterval) => {
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
