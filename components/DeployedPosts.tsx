"use client";

import React, { useState } from "react";
import { useDeployedPostsData } from "@/hooks/useDeployedPosts";
import { useOriginUrlData } from "@/hooks/useOriginUrl";

interface DeployedPostsProps {
  walletAddress: string;
}

export function DeployedPosts({ walletAddress }: DeployedPostsProps) {
  console.log(walletAddress);
  const { posts, isLoading, error } = useDeployedPostsData("0x8e87d0c68b10e07762efdf0293927162d0646f8b");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Only fetch origin URL when a post is selected
  const { originUrl, isLoading: isLoadingUrl } = useOriginUrlData(selectedPostId || "", !!selectedPostId);

  // Handle opening the Paragraph post
  const handleOpenParagraphPost = async (contractAddress: string) => {
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
      <div className="space-y-2">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg p-4">
            <h3 className="font-medium">{post.name}</h3>
            <p className="text-sm text-gray-600">Post ID: {post.postId}</p>
            <p className="text-sm text-gray-600">Symbol: {post.symbol}</p>
            <p className="text-sm text-gray-600">Max Supply: {post.maxSupply}</p>
            <p className="text-sm text-gray-600">Price: {(parseInt(post.priceWei) / 1e18).toFixed(4)} ETH</p>
            <p className="text-xs text-gray-500">
              Deployed: {new Date(parseInt(post.blockTimestamp) * 1000).toLocaleString()}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => handleOpenParagraphPost(post.clone)}
                disabled={isLoadingUrl && selectedPostId === post.clone}
                className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-2 py-1 rounded"
              >
                {isLoadingUrl && selectedPostId === post.clone ? "Loading..." : "📝 Open Paragraph Post"}
              </button>
              <a
                href={`https://basescan.org/address/${post.clone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                📄 View Contract
              </a>
              <a
                href={`https://basescan.org/tx/${post.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                🔗 View Transaction
              </a>
              <a
                href={`https://basescan.org/block/${post.blockNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                🔢 View Block
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
