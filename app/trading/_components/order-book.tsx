import React from "react";

const dummyOrders = [
  { price: "42050", amount: "0.5 BTC", type: "buy" },
  { price: "41980", amount: "1.2 BTC", type: "sell" },
  // Add more dummy data
];

export default function OrderBook() {
  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Book</h2>
      <ul>
        {dummyOrders.map((order, index) => (
          <li
            key={index}
            className={`flex justify-between py-2 ${
              order.type === "buy" ? "text-green-500" : "text-red-500"
            }`}
          >
            <span>{order.price} USD</span>
            <span>{order.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
