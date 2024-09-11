import { KlineStoreProvider } from "./_providers/kline-store-providers";

export default function TradingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KlineStoreProvider>{children}</KlineStoreProvider>;
}
