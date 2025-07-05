import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getParagraphPostUrl } from "@/lib/contract-utils";

interface OriginUrlResponse {
  contractAddress: string;
  originUrl: string | null;
}

export function useOriginUrl(
  contractAddress: string,
  enabled: boolean = false,
  options?: UseQueryOptions<OriginUrlResponse>
) {
  return useQuery({
    queryKey: ["originUrl", contractAddress],
    queryFn: async () => {
      const originUrl = await getParagraphPostUrl(contractAddress);
      return {
        contractAddress,
        originUrl
      };
    },
    enabled: !!contractAddress && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - origin URLs don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    ...options
  });
}

// Hook to get just the origin URL string
export function useOriginUrlData(contractAddress: string, enabled: boolean = false) {
  const { data, ...rest } = useOriginUrl(contractAddress, enabled);

  return {
    originUrl: data?.originUrl || null,
    ...rest
  };
}
