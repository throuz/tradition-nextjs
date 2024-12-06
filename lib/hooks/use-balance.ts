import useGlobalStore from "@/lib/stores/use-global-store";
import { TradingMode } from "@/lib/types";

import useDemoAccountStore from "../stores/use-demo-account-store";

const useBalance = () => {
  const demoAccountBalance = useDemoAccountStore((state) => state.balance);
  const tradingMode = useGlobalStore((state) => state.tradingMode);

  const balance = (() => {
    if (tradingMode === TradingMode.Demo) {
      return demoAccountBalance;
    }
    if (tradingMode === TradingMode.Real) {
      return 0;
    }
    return 0;
  })();

  return balance;
};

export default useBalance;
