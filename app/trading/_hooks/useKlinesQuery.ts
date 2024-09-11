import { KlinesRequestParams, KlinesResponse } from "@/app/api/klines/types";
import { useQuery } from "@tanstack/react-query";

const fetchKlineData = async (
  params: KlinesRequestParams
): Promise<KlinesResponse> => {
  const url = new URL("/api/klines", window.location.origin);
  Object.keys(params).forEach((key) => {
    if (params[key as keyof KlinesRequestParams] !== undefined) {
      url.searchParams.append(
        key,
        String(params[key as keyof KlinesRequestParams])
      );
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
};

export const useKlinesQuery = (params: KlinesRequestParams) => {
  return useQuery<KlinesResponse, Error>({
    queryKey: ["klines", params],
    queryFn: () => fetchKlineData(params),
  });
};
