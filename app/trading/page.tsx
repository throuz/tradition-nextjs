import React from "react";

import OrderEntry from "./_components/order-entry";
import SymbolDataCard from "./_components/symbol-data-card";
import UserPortfolio from "./_components/user-portfolio";

export default function Trading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
      <div className="col-span-4 lg:col-span-2">
        <SymbolDataCard />
      </div>
      <div className="col-span-4 lg:col-span-1">
        <OrderEntry />
      </div>
      <div className="col-span-4">
        <UserPortfolio />
      </div>
    </div>
  );
}
