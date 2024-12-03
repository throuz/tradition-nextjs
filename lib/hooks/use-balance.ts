import useGlobalStore from "@/lib/hooks/use-global-store";
import { TradingMode } from "@/lib/types";

const useBalance = () => {
  const { balance: demoBalance, tradingMode } = useGlobalStore();

  const balance = (() => {
    if (tradingMode === TradingMode.Demo) {
      return demoBalance;
    }
    if (tradingMode === TradingMode.Real) {
      return 0;
    }
    return 0;
  })();

  return balance;
};

export default useBalance;
