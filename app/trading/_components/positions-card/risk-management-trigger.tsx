import { useEffect } from "react";
import { toast } from "sonner";

import useDemoAccountStore from "@/lib/stores/use-demo-account-store";
import useLastPriceStream from "@/lib/streams/use-last-price-stream";
import { OrderSide, Position, PositionStatus } from "@/lib/types";
import { calculatePnl } from "@/lib/utils";

const RiskManagementTrigger = ({ position }: { position: Position }) => {
  const {
    id,
    symbol,
    entryPrice,
    size,
    side,
    takeProfitPrice,
    stopLossPrice,
    liquidationPrice,
    initialMargin,
  } = position;
  const lastPriceStream = useLastPriceStream(symbol);
  const demoAccountUpdateBalance = useDemoAccountStore(
    (state) => state.updateBalance
  );
  const demoAccountUpdatePosition = useDemoAccountStore(
    (state) => state.updatePosition
  );

  useEffect(() => {
    if (!lastPriceStream) return;
    const lastPrice = Number(lastPriceStream);
    const isTPSLTriggered = (() => {
      if (side === OrderSide.Buy) {
        return (
          (takeProfitPrice && lastPrice >= takeProfitPrice) ||
          (stopLossPrice && lastPrice <= stopLossPrice)
        );
      }
      if (side === OrderSide.Sell) {
        return (
          (takeProfitPrice && lastPrice <= takeProfitPrice) ||
          (stopLossPrice && lastPrice >= stopLossPrice)
        );
      }
      return false;
    })();
    const isLiqTriggered = (() => {
      if (side === OrderSide.Buy) {
        return lastPrice <= liquidationPrice;
      }
      if (side === OrderSide.Sell) {
        return lastPrice >= liquidationPrice;
      }
      return false;
    })();
    if (isTPSLTriggered) {
      const pnl = calculatePnl({ lastPrice, entryPrice, size, side });
      demoAccountUpdateBalance(initialMargin + pnl);
      demoAccountUpdatePosition(id, {
        status: PositionStatus.Closed,
        closePrice: lastPrice,
        realizedPnL: pnl,
        closedAt: Date.now(),
      });
      toast.success("Position closed successfully");
    }
    if (isLiqTriggered) {
      demoAccountUpdatePosition(id, {
        status: PositionStatus.Closed,
        closePrice: lastPrice,
        realizedPnL: -initialMargin,
        closedAt: Date.now(),
      });
      toast.success("Position closed successfully");
    }
  }, [
    demoAccountUpdateBalance,
    demoAccountUpdatePosition,
    entryPrice,
    id,
    initialMargin,
    lastPriceStream,
    liquidationPrice,
    side,
    size,
    stopLossPrice,
    takeProfitPrice,
  ]);

  return <></>;
};

export default RiskManagementTrigger;
