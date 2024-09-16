import { Facebook, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background py-8 px-6 md:px-8">
      <div className="flex md:flex-row justify-between items-center gap-6">
        <nav className="flex flex-col md:flex-row gap-4 md:gap-8 text-base font-medium">
          <Link
            href="/privacy-policy"
            className="text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact"
            className="text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
        </nav>
        <div className="flex gap-6">
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <Twitter className="h-6 w-6 text-muted-foreground hover:text-foreground" />
          </Link>
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Facebook className="h-6 w-6 text-muted-foreground hover:text-foreground" />
          </Link>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Tradixion. All rights reserved.
      </div>
    </footer>
  );
}
