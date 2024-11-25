"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fetchTicker } from "@/lib/api/ticker";
import { useGlobalStore } from "@/lib/hooks/use-global-store";
import { Position } from "@/lib/types";
import { calculatePnl } from "@/lib/utils";

const CloseButton = ({ position }: { position: Position }) => {
  const { closePosition, updateBalance } = useGlobalStore();

  const onClose = async () => {
    try {
      const tickerResponse = await fetchTicker(position.symbol);
      const lastPrice = Number(tickerResponse.price);
      const pnl = calculatePnl({
        lastPrice,
        entryPrice: position.entryPrice,
        size: position.size,
        side: position.side,
      });
      updateBalance(pnl);
      closePosition(position.id);
      toast.success("Close position success");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Button variant="destructive" className="bg-red-700" onClick={onClose}>
      Close
    </Button>
  );
};

export default CloseButton;
