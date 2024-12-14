"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import useDemoAccountStore from "@/lib/stores/use-demo-account-store";
import { OrderSide, Position, PositionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    accessorKey: "closePrice",
    header: "Close Price",
    cell: (props) => `$${props.getValue<number>().toLocaleString()}`,
  },
  {
    accessorKey: "realizedPnL",
    header: "PNL (ROI %)",
    cell: (props) => {
      const pnl = props.getValue<number>();
      const initialMargin = props.row.getValue<number>("initialMargin");
      const roi = (pnl / initialMargin) * 100;
      const formattedPnl = `${pnl >= 0 ? "+" : "-"}$${Math.abs(pnl).toFixed(
        2
      )}`;
      const formattedRoi = `${roi >= 0 ? "+" : "-"}${Math.abs(roi).toFixed(
        2
      )}%`;

      return (
        <div
          className={cn(pnl > 0 ? "text-green-500" : "text-red-500")}
        >{`${formattedPnl} (${formattedRoi})`}</div>
      );
    },
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
    accessorKey: "closedAt",
    header: "Closed At",
    cell: (props) => new Date(props.getValue<number>()).toLocaleString(),
  },
];

const ClosedPositionsTable = () => {
  const demoAccountPositions = useDemoAccountStore((state) => state.positions);

  const data = demoAccountPositions
    .filter((position) => position.status === PositionStatus.Closed)
    .sort((a, b) => (b.closedAt ?? 0) - (a.closedAt ?? 0));

  return <DataTable data={data} columns={columns} />;
};

export default ClosedPositionsTable;
