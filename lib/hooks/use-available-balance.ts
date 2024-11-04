import { useMemo } from "react";

import { useGlobalStore } from "@/lib/hooks/use-global-store";
import { TradingMode } from "@/lib/types";

export function useAvailableBalance() {
  const { availableBalance, tradingMode } = useGlobalStore();

  const balance = useMemo(() => {
    if (tradingMode === TradingMode.Demo) {
      return availableBalance;
    }
    if (tradingMode === TradingMode.Real) {
      return 0;
    }
    return 0;
  }, [availableBalance, tradingMode]);

  return balance;
}
