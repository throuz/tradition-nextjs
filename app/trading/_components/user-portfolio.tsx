import React from "react";

export default function UserPortfolio() {
  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>
      <div>
        <div className="flex justify-between py-2">
          <span>Total Balance</span>
          <span>$10,000 USD</span>
        </div>
        <div className="flex justify-between py-2">
          <span>BTC Holdings</span>
          <span>1.5 BTC</span>
        </div>
        {/* Add more portfolio items */}
      </div>
    </div>
  );
}
