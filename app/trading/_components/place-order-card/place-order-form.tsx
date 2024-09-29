import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { fetchTickerPrice } from "@/app/api/ticker/hooks";
import { TickerPriceResponse } from "@/app/api/ticker/types";
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

import { usePriceDecimalDigits } from "../../_hooks/usePriceDecimalDigits";
import { useKlineStore } from "../../_providers/kline-store-providers";

const validateTPSL = (
  orderSide: OrderSide,
  latestPrice: number,
  takeProfitPrice?: number,
  stopLossPrice?: number
): { takeProfitPrice?: string; stopLossPrice?: string } => {
  const errors: { takeProfitPrice?: string; stopLossPrice?: string } = {};

  if (orderSide === OrderSide.Buy) {
    if (takeProfitPrice !== undefined && takeProfitPrice <= latestPrice) {
      errors.takeProfitPrice = `Take Profit Price must be greater than ${latestPrice}.`;
    }
    if (stopLossPrice !== undefined && stopLossPrice >= latestPrice) {
      errors.stopLossPrice = `Stop Loss Price must be less than ${latestPrice}.`;
    }
  }

  if (orderSide === OrderSide.Sell) {
    if (takeProfitPrice !== undefined && takeProfitPrice >= latestPrice) {
      errors.takeProfitPrice = `Take Profit Price must be less than ${latestPrice}.`;
    }
    if (stopLossPrice !== undefined && stopLossPrice <= latestPrice) {
      errors.stopLossPrice = `Stop Loss Price must be greater than ${latestPrice}.`;
    }
  }

  return errors;
};

export function PlaceOrderForm() {
  const availableBalance = 1000; // Example balance; replace with actual balance from context/store

  const { symbol } = useKlineStore((state) => state);
  const priceDecimalDigits = usePriceDecimalDigits();

  const formSchema = z.object({
    orderSide: z.nativeEnum(OrderSide, {
      errorMap: () => ({ message: "Invalid order side" }),
    }),
    leverage: z
      .number()
      .int({ message: "Leverage must be an integer." })
      .min(1, { message: "Leverage must be at least 1." })
      .max(200, { message: "Leverage cannot exceed 200." }),
    amount: z
      .number()
      .min(0.01, { message: "Amount must be at least 0.01." })
      .max(availableBalance, {
        message: `Amount cannot exceed ${availableBalance}.`,
      })
      .refine((value) => Number(value.toFixed(2)) === value, {
        message: "Amount can have at most 2 decimal places.",
      }),
    takeProfitPrice: z
      .number()
      .positive()
      .refine((value) => Number(value.toFixed(priceDecimalDigits)) === value, {
        message: `Take Profit Price can have at most ${priceDecimalDigits} decimal places.`,
      })
      .optional(),
    stopLossPrice: z
      .number()
      .positive()
      .refine((value) => Number(value.toFixed(priceDecimalDigits)) === value, {
        message: `Stop Loss Price can have at most ${priceDecimalDigits} decimal places.`,
      })
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const validateValues = async (
    values: z.infer<typeof formSchema>
  ): Promise<boolean> => {
    try {
      const { price: latestPrice } = (await fetchTickerPrice(
        symbol
      )) as TickerPriceResponse;

      const { orderSide, takeProfitPrice, stopLossPrice } = values;

      const { takeProfitPrice: takeProfitError, stopLossPrice: stopLossError } =
        validateTPSL(
          orderSide,
          Number(latestPrice),
          takeProfitPrice,
          stopLossPrice
        );

      if (takeProfitError) {
        form.setError("takeProfitPrice", { message: takeProfitError });
      }
      if (stopLossError) {
        form.setError("stopLossPrice", { message: stopLossError });
      }

      return !takeProfitError && !stopLossError;
    } catch (error) {
      form.setError("root", { message: "unknown error." });
      return false;
    }
  };

  const handleOrderPlacement = async (values: z.infer<typeof formSchema>) => {
    const isValid = await validateValues(values);

    if (isValid) {
      toast.success(`Order placed: ${JSON.stringify(values)}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleOrderPlacement)}
        className="space-y-4"
      >
        <div className="mb-4">
          <span className="block mb-1">
            Available Balance: ${availableBalance.toFixed(2)}
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
                <Input
                  type="number"
                  placeholder="Enter leverage"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(
                      value === "" ? undefined : Number(event.target.value)
                    );
                  }}
                />
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
                <Input
                  type="number"
                  placeholder="Enter amount"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(
                      value === "" ? undefined : Number(event.target.value)
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="takeProfitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Take Profit Price (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Set take profit price"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(
                      value === "" ? undefined : Number(event.target.value)
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stopLossPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stop Loss Price (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Set stop loss price"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(
                      value === "" ? undefined : Number(event.target.value)
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="text-red-500 mb-4">
            {form.formState.errors.root.message}
          </div>
        )}

        <Button type="submit">Place Order</Button>
      </form>
    </Form>
  );
}
