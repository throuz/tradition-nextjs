import React from "react";

import PlaceOrderCard from "./_components/place-order-card";
import SymbolDataCard from "./_components/symbol-data-card";
import UserPortfolio from "./_components/user-portfolio";

export default function Trading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
      <div className="col-span-4 lg:col-span-3">
        <SymbolDataCard />
      </div>
      <div className="col-span-4 lg:col-span-1">
        <PlaceOrderCard />
      </div>
      <div className="col-span-4">
        <UserPortfolio />
      </div>
    </div>
  );
}
