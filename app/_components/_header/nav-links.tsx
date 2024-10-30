"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { name: string; href: string }[] = [
  { name: "Home", href: "/" },
  { name: "Trading", href: "/trading" },
  { name: "Features", href: "/features" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Support", href: "/support" },
  { name: "Account", href: "/account" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "transition-colors hover:text-foreground",
              pathname === link.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
