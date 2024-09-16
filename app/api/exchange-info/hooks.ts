import { useQuery } from "@tanstack/react-query";

import { ExchangeInfoResponse } from "@/app/api/exchange-info/types";

const fetchExchangeInfo = async (): Promise<ExchangeInfoResponse> => {
  const response = await fetch("/api/exchange-info");
  if (!response.ok) throw new Error("Failed to fetch exchange information");
  return response.json();
};

export const useExchangeInfoQuery = () => {
  return useQuery({
    queryKey: ["exchangeInfo"],
    queryFn: fetchExchangeInfo,
  });
};
