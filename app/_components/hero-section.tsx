import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="text-center px-10 py-48 bg-gradient-to-b from-dark-bg to-black">
      <div className="text-5xl font-extrabold text-foreground mb-5">
        Maximize Your Trading Potential with Tradixion
      </div>
      <div className="text-xl text-muted-foreground mb-10">
        Leverage every dollar, enjoy zero fees, and trade seamlessly with ETH.
      </div>
      <Button size="lg" className="text-xl">
        Get Started
      </Button>
    </div>
  );
}
