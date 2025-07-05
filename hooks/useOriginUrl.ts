import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getPostUrl } from "@/lib/contract-utils";

interface OriginUrlResponse {
  contractAddress: string;
  originUrl: string | null;
}

export function useOriginUrl(
  contractAddress: string,
  postType: "paragraph" | "mirror" = "paragraph",
  enabled: boolean = false,
  options?: UseQueryOptions<OriginUrlResponse>
) {
  return useQuery({
    queryKey: ["originUrl", contractAddress, postType],
    queryFn: async () => {
      const originUrl = await getPostUrl(contractAddress, postType);
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
export function useOriginUrlData(
  contractAddress: string,
  postType: "paragraph" | "mirror" = "paragraph",
  enabled: boolean = false
) {
  const { data, ...rest } = useOriginUrl(contractAddress, postType, enabled);

  return {
    originUrl: data?.originUrl || null,
    ...rest
  };
}
