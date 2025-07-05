import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DeployedPostsResponse } from "@/lib/queries";

export function useDeployedPosts(talentIdentifier: string, options?: UseQueryOptions<DeployedPostsResponse>) {
  return useQuery({
    queryKey: ["deployedPosts", talentIdentifier],
    queryFn: async () => {
      const response = await fetch(`/api/deployed-posts?talentIdentifier=${encodeURIComponent(talentIdentifier)}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch deployed posts");
      }

      return response.json();
    },
    enabled: !!talentIdentifier,
    ...options
  });
}

// Helper function to extract just the posts data
export function useDeployedPostsData(talentIdentifier: string) {
  const { data, ...rest } = useDeployedPosts(talentIdentifier);

  return {
    posts: data?.contractDeployeds || [],
    paragraphCount: data?.paragraphCount || 0,
    mirrorCount: data?.mirrorCount || 0,
    ...rest
  };
}
