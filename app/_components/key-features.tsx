import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Percent, DollarSign, Shield, Play } from "lucide-react";

const keyFeatureCards: { title: string; content: string; icon: JSX.Element }[] =
  [
    {
      title: "Full Fund Utilization",
      content:
        "Leverage every cent with Tradixion’s advanced fund utilization.",
      icon: <Percent className="h-8 w-8 text-primary" />,
    },
    {
      title: "Fee Reduction with TRDX",
      content: "Hold TRDX for up to zero transaction fees.",
      icon: <DollarSign className="h-8 w-8 text-primary" />,
    },
    {
      title: "ETH-Only System",
      content: "Deposit and withdraw with ETH, seamlessly converted to USD.",
      icon: <Shield className="h-8 w-8 text-primary" />,
    },
    {
      title: "Free Trading Simulation",
      content: "Practice trading risk-free with our simulation feature.",
      icon: <Play className="h-8 w-8 text-primary" />,
    },
  ];

export default function KeyFeatures() {
  return (
    <div className="p-10 bg-gradient-to-b from-dark-bg to-black text-foreground">
      <h1 className="text-center text-4xl font-extrabold mb-10">
        Key Features
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {keyFeatureCards.map((keyFeature) => (
          <Card
            key={keyFeature.title}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="space-y-2 pb-4 text-center">
              <div className="flex justify-center mb-4">{keyFeature.icon}</div>
              <CardTitle className="text-xl font-bold">
                {keyFeature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{keyFeature.content}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
