"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fetchTicker } from "@/lib/api/ticker";
import useDemoAccountStore from "@/lib/stores/use-demo-account-store";
import { Position, PositionStatus } from "@/lib/types";
import { calculatePnl } from "@/lib/utils";

const ClosePositionButton = ({ position }: { position: Position }) => {
  const demoAccountUpdateBalance = useDemoAccountStore(
    (state) => state.updateBalance
  );
  const demoAccountUpdatePosition = useDemoAccountStore(
    (state) => state.updatePosition
  );

  const handleClosePosition = async () => {
    try {
      const { id, symbol, entryPrice, size, side } = position;
      const tickerResponse = await fetchTicker(symbol);
      const lastPrice = Number(tickerResponse.price);
      const pnl = calculatePnl({ lastPrice, entryPrice, size, side });
      demoAccountUpdateBalance(pnl);
      demoAccountUpdatePosition(id, {
        status: PositionStatus.Closed,
        closePrice: lastPrice,
        realizedPnL: pnl,
        closedAt: Date.now(),
      });
      toast.success("Position closed successfully");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Button
      variant="destructive"
      className="bg-red-700"
      onClick={handleClosePosition}
    >
      Close
    </Button>
  );
};

export default ClosePositionButton;
