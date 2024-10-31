"use client";

import { ReactNode } from "react";
import { MetaMaskProvider, MetaMaskSDKOptions } from "@metamask/sdk-react";

import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";

const sdkOptions: MetaMaskSDKOptions = {
  dappMetadata: {},
};

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MetaMaskProvider sdkOptions={sdkOptions}>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryProvider>
    </MetaMaskProvider>
  );
}
