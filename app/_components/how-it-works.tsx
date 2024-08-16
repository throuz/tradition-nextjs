import { UserPlus, Wallet, TrendingUp } from "lucide-react";

const steps: { title: string; description: string; icon: JSX.Element }[] = [
  {
    title: "Sign Up",
    description: "Create your account quickly.",
    icon: <UserPlus className="h-10 w-10 text-blue-400" />,
  },
  {
    title: "Deposit ETH",
    description: "Use MetaMask to deposit ETH, automatically converted to USD.",
    icon: <Wallet className="h-10 w-10 text-blue-400" />,
  },
  {
    title: "Start Trading or Simulate",
    description:
      "Trade with real funds or practice risk-free with our simulation.",
    icon: <TrendingUp className="h-10 w-10 text-blue-400" />,
  },
];

export default function HowItWorks() {
  return (
    <div className="p-10 pb-20 bg-gradient-to-b from-dark-bg to-black">
      <h1 className="text-center text-4xl font-extrabold text-white mb-16">
        How It Works
      </h1>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-white">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-800">
              {step.icon}
            </div>
            <h3 className="text-lg font-bold">{step.title}</h3>
            <p className="text-base text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 flex justify-center">
        <button className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}
