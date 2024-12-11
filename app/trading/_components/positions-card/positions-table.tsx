"use client";

import { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { DataTable } from "@/components/ui/data-table";
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

const columns: ColumnDef<Position>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: (props) => props.getValue<string>(),
  },
  {
    accessorKey: "side",
    header: "Side",
    cell: (props) => {
      const side = props.getValue<OrderSide>();
      const orderSideMap: Record<OrderSide, string> = {
        [OrderSide.Buy]: "Buy",
        [OrderSide.Sell]: "Sell",
      };
      return (
        <div
          className={cn(
            side === OrderSide.Buy && "text-green-500",
            side === OrderSide.Sell && "text-red-500"
          )}
        >
          {orderSideMap[side]}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: (props) => {
      const size = props.getValue<number>();
      const formatedSize = size.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
      const symbol = props.row.getValue<string>("symbol");
      const formatedSymbol = symbol.replace(/USDT$/, "");
      return `${formatedSize} ${formatedSymbol}`;
    },
  },
  {
    accessorKey: "entryPrice",
    header: "Entry Price",
    cell: (props) => `$${props.getValue<number>().toLocaleString()}`,
  },
  {
    id: "lastPrice",
    header: "Last Price",
    cell: (props) => (
      <LastPriceCell symbol={props.row.getValue<string>("symbol")} />
    ),
  },
  {
    id: "pnl",
    header: "PNL (ROI %)",
    cell: (props) => <PnlRoiCell position={props.row.original} />,
  },
  {
    accessorKey: "leverage",
    header: "Leverage",
    cell: (props) => props.getValue<number>(),
  },
  {
    accessorKey: "initialMargin",
    header: "Initial Margin",
    cell: (props) => `$${props.getValue<number>().toLocaleString()}`,
  },
  {
    accessorKey: "liquidationPrice",
    header: "Liq. Price",
    cell: (props) => `$${props.getValue<number>().toLocaleString()}`,
  },
  {
    accessorKey: "takeProfitPrice",
    header: "Take Profit",
    cell: (props) =>
      props.getValue<number>()
        ? `$${props.getValue<number>().toLocaleString()}`
        : "-",
  },
  {
    accessorKey: "stopLossPrice",
    header: "Stop Loss",
    cell: (props) =>
      props.getValue<number>()
        ? `$${props.getValue<number>().toLocaleString()}`
        : "-",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (props) => new Date(props.getValue<number>()).toLocaleString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: (props) => (
      <div className="flex gap-2 justify-center">
        <SetTPSLDialogButton position={props.row.original} />
        <ClosePositionButton position={props.row.original} />
      </div>
    ),
  },
];

const PositionsTable = () => {
  const demoAccountPositions = useDemoAccountStore((state) => state.positions);

  const data = demoAccountPositions.filter(
    (position) => position.status === PositionStatus.Open
  );

  return <DataTable data={data} columns={columns} />;
};

export default PositionsTable;
