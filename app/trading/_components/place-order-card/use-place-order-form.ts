import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z, ZodIssueCode } from "zod";

import { fetchTicker } from "@/lib/api/ticker";
import useBalance from "@/lib/hooks/use-balance";
import useDemoAccountStore from "@/lib/hooks/use-demo-account-store";
import { OrderSide, Position } from "@/lib/types";
import { calculateLiqPrice } from "@/lib/utils";

import { usePriceDecimalDigits } from "./use-price-decimal-digits";

const usePlaceOrderForm = () => {
  const demoAccountUpdateBalance = useDemoAccountStore(
    (state) => state.updateBalance
  );
  const demoAccountCreatePosition = useDemoAccountStore(
    (state) => state.createPosition
  );
  const balance = useBalance();
  const priceDecimalDigits = usePriceDecimalDigits();
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol") as string;

  const formSchema = z
    .object({
      orderSide: z.preprocess(
        (val) => (val ? val : undefined),
        z.nativeEnum(OrderSide)
      ),
      leverage: z.preprocess(
        (val) => (val ? Number(val) : undefined),
        z
          .number()
          .int({ message: "Leverage must be an integer" })
          .min(1, { message: "Leverage must be at least 1" })
          .max(200, { message: "Leverage cannot exceed 200" })
      ),
      amount: z.preprocess(
        (val) => (val ? Number(val) : undefined),
        z
          .number()
          .min(0.01, { message: "Amount must be at least 0.01" })
          .max(balance, {
            message: `Amount cannot exceed ${balance}`,
          })
          .refine((value) => Number(value.toFixed(2)) === value, {
            message: "Amount can have at most 2 decimal places",
          })
      ),
      takeProfitPrice: z.preprocess(
        (val) => (val ? Number(val) : undefined),
        z
          .number()
          .min(0.00000001, {
            message: "Take Profit Price must be at least 0.00000001",
          })
          .max(10000000, {
            message: "Take Profit Price cannot exceed 10000000",
          })
          .refine(
            (value) => Number(value.toFixed(priceDecimalDigits)) === value,
            {
              message: `Take Profit Price can have at most ${priceDecimalDigits} decimal places`,
            }
          )
          .optional()
      ),
      stopLossPrice: z.preprocess(
        (val) => (val ? Number(val) : undefined),
        z
          .number()
          .min(0.00000001, {
            message: "Stop Loss Price must be at least 0.00000001",
          })
          .max(10000000, {
            message: "Stop Loss Price cannot exceed 10000000",
          })
          .refine(
            (value) => Number(value.toFixed(priceDecimalDigits)) === value,
            {
              message: `Stop Loss Price can have at most ${priceDecimalDigits} decimal places`,
            }
          )
          .optional()
      ),
    })
    .superRefine(async (values, ctx) => {
      const { orderSide, leverage, takeProfitPrice, stopLossPrice } = values;
      try {
        if (takeProfitPrice || stopLossPrice) {
          const tickerResponse = await fetchTicker(symbol);
          const latestPrice = Number(tickerResponse.price);
          const liquidationPrice = calculateLiqPrice({
            orderSide,
            leverage,
            entryPrice: latestPrice,
          });
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
            if (stopLossPrice && stopLossPrice <= liquidationPrice) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                path: ["stopLossPrice"],
                message: `Stop Loss Price must be greater than ${liquidationPrice.toFixed(
                  priceDecimalDigits
                )}`,
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
            if (stopLossPrice && stopLossPrice >= liquidationPrice) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                path: ["stopLossPrice"],
                message: `Stop Loss Price must be less than ${liquidationPrice.toFixed(
                  priceDecimalDigits
                )}`,
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

  const defaultValues = {
    orderSide: "",
    leverage: "",
    amount: "",
    takeProfitPrice: "",
    stopLossPrice: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as unknown as z.infer<typeof formSchema>,
  });

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const id = nanoid();
        const { orderSide, leverage, amount, takeProfitPrice, stopLossPrice } =
          values;
        const tickerResponse = await fetchTicker(symbol);
        const entryPrice = Number(tickerResponse.price);
        const size = (amount * leverage) / entryPrice;
        const liquidationPrice = calculateLiqPrice({
          orderSide,
          leverage,
          entryPrice,
        });
        const position: Position = {
          id: id,
          accountId: "demo",
          side: orderSide,
          symbol: symbol,
          size: size,
          entryPrice: entryPrice,
          leverage: leverage,
          initialMargin: amount,
          liquidationPrice: liquidationPrice,
          takeProfitPrice: takeProfitPrice,
          stopLossPrice: stopLossPrice,
          createdAt: Date.now(),
        };
        demoAccountCreatePosition(position);
        demoAccountUpdateBalance(-amount);
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
