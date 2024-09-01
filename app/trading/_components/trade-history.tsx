import React from "react";

const dummyTrades = [
  { price: "42000", amount: "0.3 BTC", time: "2 mins ago" },
  { price: "41950", amount: "0.1 BTC", time: "5 mins ago" },
  // Add more dummy data
];

export default function TradeHistory() {
  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Trade History</h2>
      <ul>
        {dummyTrades.map((trade, index) => (
          <li key={index} className="flex justify-between py-2">
            <span>{trade.price} USD</span>
            <span>{trade.amount}</span>
            <span className="text-muted-foreground">{trade.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
