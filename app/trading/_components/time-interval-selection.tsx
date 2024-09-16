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
import { KlineInterval } from "@/lib/types";

interface TimeIntervalSelectionProps {
  selectedInterval: KlineInterval;
  onSelectInterval: (interval: KlineInterval) => void;
}

export function TimeIntervalSelection({
  selectedInterval,
  onSelectInterval,
}: TimeIntervalSelectionProps) {
  const intervals = Object.values(KlineInterval);

  return (
    <Select
      onValueChange={(value) => onSelectInterval(value as KlineInterval)}
      value={selectedInterval}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a time interval" />
      </SelectTrigger>
      <SelectContent>
        {intervals.map((interval) => (
          <SelectItem key={interval} value={interval}>
            {interval}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
