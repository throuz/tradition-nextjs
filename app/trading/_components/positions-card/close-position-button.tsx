"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fetchTicker } from "@/lib/api/ticker";
import useGlobalStore from "@/lib/hooks/use-global-store";
import { Position } from "@/lib/types";
import { calculatePnl } from "@/lib/utils";

const ClosePositionButton = ({ position }: { position: Position }) => {
  const { deletePosition, updateBalance } = useGlobalStore();

  const handleClosePosition = async () => {
    try {
      const tickerResponse = await fetchTicker(position.symbol);
      const pnl = calculatePnl({
        lastPrice: Number(tickerResponse.price),
        entryPrice: position.entryPrice,
        size: position.size,
        side: position.side,
      });
      updateBalance(pnl);
      deletePosition(position.id);
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
