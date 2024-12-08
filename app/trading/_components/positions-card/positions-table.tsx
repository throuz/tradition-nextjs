"use client";

import { ReactNode, useEffect } from "react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDemoAccountStore from "@/lib/stores/use-demo-account-store";
import useLastPriceStream from "@/lib/streams/use-last-price-stream";
import { OrderSide, Position, PositionStatus } from "@/lib/types";
import { calculatePnl, cn } from "@/lib/utils";

import ClosePositionButton from "./close-position-button";
import SetTPSLDialogButton from "./set-tpsl-dialog-button";

const LastPriceCell = ({ symbol }: { symbol: string }) => {
  const lastPriceStream = useLastPriceStream(symbol);
  if (lastPriceStream) {
    return `$${lastPriceStream.toLocaleString()}`;
  }
  return "-";
};

const PnlRoiCell = ({ position }: { position: Position }) => {
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

  if (!lastPriceStream) {
    return "-";
  }

  const pnl = calculatePnl({
    lastPrice: Number(lastPriceStream),
    entryPrice: entryPrice,
    size: size,
    side: side,
  });
  const roi = (pnl / initialMargin) * 100;
  const formattedPnl = `${pnl >= 0 ? "+" : "-"}$${Math.abs(pnl).toFixed(2)}`;
  const formattedRoi = `${roi >= 0 ? "+" : "-"}${Math.abs(roi).toFixed(2)}%`;

  return (
    <div
      className={cn(pnl > 0 ? "text-green-500" : "text-red-500")}
    >{`${formattedPnl} (${formattedRoi})`}</div>
  );
};

interface Column {
  head: string;
  cell: (rowData: Position) => ReactNode;
}

const columns: Column[] = [
  {
    head: "Symbol",
    cell: (rowData) => rowData.symbol,
  },
  {
    head: "Side",
    cell: (rowData) => {
      const orderSideMap: Record<OrderSide, string> = {
        [OrderSide.Buy]: "Buy",
        [OrderSide.Sell]: "Sell",
      };
      return (
        <div
          className={cn(
            rowData.side === OrderSide.Buy && "text-green-500",
            rowData.side === OrderSide.Sell && "text-red-500"
          )}
        >
          {orderSideMap[rowData.side]}
        </div>
      );
    },
  },
  {
    head: "Size",
    cell: (rowData) => {
      const formatedSize = rowData.size.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
      const formatedSymbol = rowData.symbol.replace(/USDT$/, "");
      return `${formatedSize} ${formatedSymbol}`;
    },
  },
  {
    head: "Entry Price",
    cell: (rowData) => `$${rowData.entryPrice.toLocaleString()}`,
  },
  {
    head: "Last Price",
    cell: (rowData) => <LastPriceCell symbol={rowData.symbol} />,
  },
  {
    head: "PNL (ROI %)",
    cell: (rowData) => <PnlRoiCell position={rowData} />,
  },
  {
    head: "Leverage",
    cell: (rowData) => rowData.leverage,
  },
  {
    head: "Initial Margin",
    cell: (rowData) => `$${rowData.initialMargin.toLocaleString()}`,
  },
  {
    head: "Liq. Price",
    cell: (rowData) => `$${rowData.liquidationPrice.toLocaleString()}`,
  },
  {
    head: "Take Profit",
    cell: (rowData) =>
      rowData.takeProfitPrice
        ? `$${rowData.takeProfitPrice.toLocaleString()}`
        : "-",
  },
  {
    head: "Stop Loss",
    cell: (rowData) =>
      rowData.stopLossPrice
        ? `$${rowData.stopLossPrice.toLocaleString()}`
        : "-",
  },
  {
    head: "Created At",
    cell: (rowData) => new Date(rowData.createdAt).toLocaleString(),
  },
  {
    head: "Actions",
    cell: (rowData) => (
      <div className="flex gap-2 justify-center">
        <SetTPSLDialogButton position={rowData} />
        <ClosePositionButton position={rowData} />
      </div>
    ),
  },
];

const PositionsTable = () => {
  const demoAccountPositions = useDemoAccountStore((state) => state.positions);

  const demoAccountOpenPositions = demoAccountPositions.filter(
    (position) => position.status === PositionStatus.Open
  );

  const heads = columns.map((column, i) => (
    <TableHead key={i} className="text-center">
      {column.head}
    </TableHead>
  ));

  const cells = (position: Position) =>
    columns.map((column, i) => (
      <TableCell key={i} className="text-center">
        {column.cell(position)}
      </TableCell>
    ));

  return (
    <Table>
      <TableCaption>Your open trading positions.</TableCaption>
      <TableHeader>
        <TableRow>{heads}</TableRow>
      </TableHeader>
      <TableBody>
        {demoAccountOpenPositions.map((position) => (
          <TableRow key={position.id}>{cells(position)}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PositionsTable;
