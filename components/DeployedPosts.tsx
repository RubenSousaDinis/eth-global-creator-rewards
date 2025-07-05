"use client";

import React, { useState } from "react";
import { useDeployedPostsData } from "@/hooks/useDeployedPosts";
import { useOriginUrlData } from "@/hooks/useOriginUrl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DeployedPostsProps {
  walletAddress: string;
}

export function DeployedPosts({ walletAddress }: DeployedPostsProps) {
  console.log(walletAddress);
  const { posts, isLoading, error } = useDeployedPostsData("0x8e87d0c68b10e07762efdf0293927162d0646f8b");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Only fetch origin URL when a post is selected
  const { originUrl, isLoading: isLoadingUrl } = useOriginUrlData(selectedPostId || "", !!selectedPostId);

  // Handle clicking to get the post URL
  const handleGetPostUrl = async (contractAddress: string) => {
    setSelectedPostId(contractAddress);
  };

  // Open URL when it's fetched
  React.useEffect(() => {
    if (originUrl && selectedPostId) {
      window.open(originUrl, "_blank");
      setSelectedPostId(null); // Reset selection
    }
  }, [originUrl, selectedPostId]);

  if (isLoading) {
    return <div>Loading deployed posts...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error.message}</div>;
  }

  if (posts.length === 0) {
    return <div>No deployed posts found for this wallet address.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Deployed Posts ({posts.length})</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Deployed:</strong> {new Date(parseInt(post.blockTimestamp) * 1000).toLocaleString()}
                </p>
                <div>
                  <button
                    onClick={() => handleGetPostUrl(post.clone)}
                    disabled={isLoadingUrl && selectedPostId === post.clone}
                    className="text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1.5 rounded-md transition-colors"
                  >
                    {isLoadingUrl && selectedPostId === post.clone ? "Loading..." : "📝 Open Post URL"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
