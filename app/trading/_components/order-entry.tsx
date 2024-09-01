"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrderEntry() {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");

  const handleBuy = () => {
    // Handle Buy Order Logic
  };

  const handleSell = () => {
    // Handle Sell Order Logic
  };

  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Place Order</h2>
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Amount (BTC)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          placeholder="Price (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <div className="flex justify-between gap-4">
          <Button className="w-full" variant="default" onClick={handleBuy}>
            Buy
          </Button>
          <Button className="w-full" variant="destructive" onClick={handleSell}>
            Sell
          </Button>
        </div>
      </div>
    </div>
  );
}
