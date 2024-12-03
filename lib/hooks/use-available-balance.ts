import { useMemo } from "react";

import useGlobalStore from "@/lib/hooks/use-global-store";
import { TradingMode } from "@/lib/types";

export function useAvailableBalance() {
  const { balance: demoBalance, tradingMode } = useGlobalStore();

  const balance = useMemo(() => {
    if (tradingMode === TradingMode.Demo) {
      return demoBalance;
    }
    if (tradingMode === TradingMode.Real) {
      return 0;
    }
    return 0;
  }, [demoBalance, tradingMode]);

  return balance;
}
