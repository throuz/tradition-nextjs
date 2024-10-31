import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { ConnectWalletButton } from "./connect-wallet-button";
import { NavLinks } from "./nav-links";

export default function Header() {
  return (
    <header className="sticky top-0 flex h-20 justify-between items-center gap-4 border-b bg-background px-6 md:px-8 z-10">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <NavLinks />
          </nav>
        </SheetContent>
      </Sheet>
      <Link
        href="/"
        className="flex items-center gap-2 text-xl font-semibold md:text-2xl italic"
      >
        Tradixion
        <span className="sr-only">Tradixion</span>
      </Link>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-6">
        <NavLinks />
      </nav>
      <ConnectWalletButton />
    </header>
  );
}
