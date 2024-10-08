import { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import Header from "./_components/_header/header";
import Footer from "./_components/footer";
import Providers from "./providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              success: "text-success",
              error: "text-error",
              info: "text-info",
              warning: "text-warning",
              loading: "text-loading",
            },
          }}
        />
      </body>
    </html>
  );
}
