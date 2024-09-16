import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KlineInterval } from "@/lib/types";
import { useKlineStore } from "../_providers/kline-store-providers";

export function KlineIntervalSelection() {
  const intervals = Object.values(KlineInterval);
  const { interval, setInterval } = useKlineStore((state) => state);

  return (
    <Select
      onValueChange={(value) => setInterval(value as KlineInterval)}
      value={interval}
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
