"use client";

import { useState, useEffect } from "react";

export interface FeedPost {
  id: string;
  name: string;
  symbol: string;
  owner: string;
  postId: string;
  priceWei: string;
  maxSupply: string;
  clone: string;
  blockTimestamp: string;
  blockNumber: string;
  transactionHash: string;
  type: "mirror" | "paragraph";
}

export interface FeedResponse {
  posts: FeedPost[];
  paragraphCount: number;
  mirrorCount: number;
  totalCount: number;
}

export function useFeed(limit: number = 20) {
  const [data, setData] = useState<FeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/feed?limit=${limit}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const feedData: FeedResponse = await response.json();
        setData(feedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch feed"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [limit]);

  return { data, isLoading, error };
}
