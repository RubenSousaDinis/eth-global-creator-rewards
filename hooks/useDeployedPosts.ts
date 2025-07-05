import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DeployedPostsResponse } from "@/lib/paragraph-queries";

export function useDeployedPosts(walletAddress: string, options?: UseQueryOptions<DeployedPostsResponse>) {
  return useQuery({
    queryKey: ["deployedPosts", walletAddress],
    queryFn: async () => {
      const response = await fetch(`/api/deployed-posts?walletAddress=${encodeURIComponent(walletAddress)}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch deployed posts");
      }

      return response.json();
    },
    enabled: !!walletAddress,
    ...options
  });
}

// Helper function to extract just the posts data
export function useDeployedPostsData(walletAddress: string) {
  const { data, ...rest } = useDeployedPosts(walletAddress);

  return {
    posts: data?.contractDeployeds || [],
    ...rest
  };
}
