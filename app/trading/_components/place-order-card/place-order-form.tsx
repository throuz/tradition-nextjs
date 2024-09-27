import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderSide } from "@/lib/types";

const formSchema = z.object({
  leverage: z.coerce
    .number()
    .min(1, { message: "Leverage must be at least 1." }),
  amount: z.coerce.number().min(1, { message: "Amount must be at least 1." }),
  takeProfit: z.coerce.number().optional(),
  stopLoss: z.coerce.number().optional(),
  orderSide: z.nativeEnum(OrderSide, {
    errorMap: () => ({ message: "Invalid order side" }),
  }),
});

export function PlaceOrderForm() {
  const availableBalance = 1000; // Example balance; replace with actual balance from context/store

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leverage: 1,
      amount: "" as unknown as number,
      takeProfit: "" as unknown as number,
      stopLoss: "" as unknown as number,
      orderSide: OrderSide.Buy,
    },
  });

  const handleOrderPlacement = (values: z.infer<typeof formSchema>) => {
    console.log("Order placed:", values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleOrderPlacement)}
        className="space-y-4"
      >
        <div className="mb-4">
          <span className="block mb-1">
            Available Balance: ${availableBalance}
          </span>
        </div>

        <FormField
          control={form.control}
          name="orderSide"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Side</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select side" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderSide.Buy}>Buy</SelectItem>
                    <SelectItem value={OrderSide.Sell}>Sell</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leverage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leverage</FormLabel>
              <FormControl>
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select leverage" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 10].map((lev) => (
                      <SelectItem key={lev} value={String(lev)}>
                        {lev}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="takeProfit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Take Profit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Set take profit price"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stopLoss"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stop Loss</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Set stop loss price"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Place Order</Button>
      </form>
    </Form>
  );
}
