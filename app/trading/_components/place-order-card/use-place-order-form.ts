import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z, ZodIssueCode } from "zod";

import { fetchTicker } from "@/lib/api/ticker";
import { useGlobalStore } from "@/lib/hooks/use-global-store";
import { OrderSide } from "@/lib/types";
import { calculateLiqPrice } from "@/lib/utils";

import { useAvailableBalance } from "../../../../lib/hooks/use-available-balance";

import { usePriceDecimalDigits } from "./use-price-decimal-digits";

const usePlaceOrderForm = () => {
  const id = useId();
  const { decreaseAvailableBalance, openPosition } = useGlobalStore();
  const availableBalance = useAvailableBalance();
  const priceDecimalDigits = usePriceDecimalDigits();
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");

  const formSchema = z
    .object({
      orderSide: z.nativeEnum(OrderSide),
      leverage: z
        .number()
        .int({ message: "Leverage must be an integer" })
        .min(1, { message: "Leverage must be at least 1" })
        .max(200, { message: "Leverage cannot exceed 200" }),
      amount: z
        .number()
        .min(0.01, { message: "Amount must be at least 0.01" })
        .max(availableBalance, {
          message: `Amount cannot exceed ${availableBalance}`,
        })
        .refine((value) => Number(value.toFixed(2)) === value, {
          message: "Amount can have at most 2 decimal places",
        }),
      takeProfitPrice: z
        .number()
        .positive({ message: "Take Profit Price must be positive" })
        .refine(
          (value) => Number(value.toFixed(priceDecimalDigits)) === value,
          {
            message: `Take Profit Price can have at most ${priceDecimalDigits} decimal places`,
          }
        )
        .optional(),
      stopLossPrice: z
        .number()
        .positive({ message: "Stop Loss Price must be positive" })
        .refine(
          (value) => Number(value.toFixed(priceDecimalDigits)) === value,
          {
            message: `Stop Loss Price can have at most ${priceDecimalDigits} decimal places`,
          }
        )
        .optional(),
    })
    .superRefine(async (values, ctx) => {
      const { orderSide, takeProfitPrice, stopLossPrice } = values;
      try {
        if (takeProfitPrice || stopLossPrice) {
          const tickerResponse = await fetchTicker(symbol ?? "");
          const latestPrice = Number(tickerResponse.price);
          if (orderSide === OrderSide.Buy) {
            if (takeProfitPrice && takeProfitPrice <= latestPrice) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                path: ["takeProfitPrice"],
                message: `Take Profit Price must be greater than ${latestPrice}`,
              });
            }
            if (stopLossPrice && stopLossPrice >= latestPrice) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                path: ["stopLossPrice"],
                message: `Stop Loss Price must be less than ${latestPrice}`,
              });
            }
          }
          if (orderSide === OrderSide.Sell) {
            if (takeProfitPrice && takeProfitPrice >= latestPrice) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                path: ["takeProfitPrice"],
                message: `Take Profit Price must be less than ${latestPrice}`,
              });
            }
            if (stopLossPrice && stopLossPrice <= latestPrice) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                path: ["stopLossPrice"],
                message: `Stop Loss Price must be greater than ${latestPrice}`,
              });
            }
          }
        }
      } catch (error) {
        if (takeProfitPrice) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["takeProfitPrice"],
            message: (error as Error).message,
          });
        }
        if (stopLossPrice) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["stopLossPrice"],
            message: (error as Error).message,
          });
        }
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const { orderSide, leverage, amount, takeProfitPrice, stopLossPrice } =
          values;
        const tickerResponse = await fetchTicker(symbol ?? "");
        const entryPrice = Number(tickerResponse.price);
        const size = (amount * leverage) / entryPrice;
        const liqPrice = calculateLiqPrice({ orderSide, leverage, entryPrice });
        openPosition({
          id: id,
          orderSide: orderSide,
          fundingAmount: amount,
          symbol: symbol as string,
          size: size,
          entryPrice: entryPrice,
          liqPrice: liqPrice as number,
          takeProfitPrice: takeProfitPrice,
          stopLossPrice: stopLossPrice,
        });
        decreaseAvailableBalance(amount);
        toast.success(`Order placed: ${JSON.stringify(values)}`);
        form.reset();
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  );

  return { form, onSubmit };
};

export default usePlaceOrderForm;
