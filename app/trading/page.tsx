import React from "react";
import MarketOverview from "./_components/market-overview";
import OrderBook from "./_components/order-book";
import OrderEntry from "./_components/order-entry";
import TradeHistory from "./_components/trade-history";
import UserPortfolio from "./_components/user-portfolio";

export default function Trading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-6">
      <div className="col-span-4 lg:col-span-2">
        <MarketOverview />
      </div>
      <div className="col-span-4 lg:col-span-1 flex flex-col gap-4">
        <OrderBook />
        <TradeHistory />
      </div>
      <div className="col-span-4 lg:col-span-1 flex flex-col gap-4">
        <OrderEntry />
        <UserPortfolio />
      </div>
    </div>
  );
}
