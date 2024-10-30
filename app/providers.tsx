"use client";

import { ReactNode } from "react";
import { MetaMaskProvider, MetaMaskSDKOptions } from "@metamask/sdk-react";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ThemeProvider } from "@/components/theme-provider";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: ReactNode }) {
  const sdkOptions: MetaMaskSDKOptions = {
    dappMetadata: {},
  };
  const queryClient = getQueryClient();
  return (
    <MetaMaskProvider sdkOptions={sdkOptions}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </MetaMaskProvider>
  );
}
