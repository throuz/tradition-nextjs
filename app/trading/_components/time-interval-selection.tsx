import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeInterval } from "../_types";

interface TimeIntervalSelectionProps {
  selectedInterval: TimeInterval;
  onSelectInterval: (interval: TimeInterval) => void;
}

export function TimeIntervalSelection({
  selectedInterval,
  onSelectInterval,
}: TimeIntervalSelectionProps) {
  const intervals = Object.values(TimeInterval);

  return (
    <Select
      onValueChange={(value) => onSelectInterval(value as TimeInterval)}
      value={selectedInterval}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a time interval" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time Intervals</SelectLabel>
          {intervals.map((interval) => (
            <SelectItem key={interval} value={interval}>
              {interval}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
