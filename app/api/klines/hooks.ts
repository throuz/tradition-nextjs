import { useQuery } from "@tanstack/react-query";

import { KlinesRequestParams, KlinesResponse } from "@/app/api/klines/types";

const fetchKlinesData = async (
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
  return useQuery({
    queryKey: ["klines", params],
    queryFn: () => fetchKlinesData(params),
  });
};
