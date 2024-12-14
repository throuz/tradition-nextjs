"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

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
      const symbol = props.row.getValue<string>("symbol");
      const formatedSymbol = symbol.replace(/USDT$/, "");
      return `${size} ${formatedSymbol}`;
    },
  },
  {
    accessorKey: "entryPrice",
    header: "Entry Price",
    cell: (props) => `$${props.getValue<number>()}`,
  },
  {
    accessorKey: "closePrice",
    header: "Close Price",
    cell: (props) => `$${props.getValue<number>()}`,
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
    cell: (props) => `$${props.getValue<number>()}`,
  },
  {
    accessorKey: "liquidationPrice",
    header: "Liq. Price",
    cell: (props) => `$${props.getValue<number>()}`,
  },
  {
    accessorKey: "takeProfitPrice",
    header: "Take Profit",
    cell: (props) =>
      props.getValue<number>() ? `$${props.getValue<number>()}` : "-",
  },
  {
    accessorKey: "stopLossPrice",
    header: "Stop Loss",
    cell: (props) =>
      props.getValue<number>() ? `$${props.getValue<number>()}` : "-",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (props) =>
      format(new Date(props.getValue<number>()), "yyyy-MM-dd HH:mm:ss"),
  },
  {
    accessorKey: "closedAt",
    header: "Closed At",
    cell: (props) =>
      format(new Date(props.getValue<number>()), "yyyy-MM-dd HH:mm:ss"),
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
