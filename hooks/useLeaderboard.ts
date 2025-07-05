"use client";

import { useState, useEffect } from "react";
import { LeaderboardEntry } from "@/app/services/types";

interface UseLeaderboardOptions {
  pageSize?: number;
  scorer?: string;
}

interface UseLeaderboardReturn {
  data: LeaderboardEntry[] | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function useLeaderboard(
  options: UseLeaderboardOptions = {},
): UseLeaderboardReturn {
  const { pageSize = 20, scorer = "creator_score" } = options;

  const [data, setData] = useState<LeaderboardEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchLeaderboard = async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call to leaderboard service
      // For now, simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: LeaderboardEntry[] = Array.from(
        { length: pageSize },
        (_, i) => {
          const rank = (pageNum - 1) * pageSize + i + 1;
          return {
            rank,
            name: `Creator ${rank}`,
            pfp: `https://github.com/shadcn.png`,
            score: Math.floor(Math.random() * 10000) + 1000,
            rewards: `${Math.floor(Math.random() * 50)}K`,
            id: `creator-${rank}`,
            talent_protocol_id: `${rank}`,
          };
        },
      );

      if (reset) {
        setData(mockData);
      } else {
        setData((prev) => (prev ? [...prev, ...mockData] : mockData));
      }

      // Simulate pagination limit
      setHasMore(pageNum < 5);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch leaderboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(1, true);
  }, [scorer]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLeaderboard(nextPage, false);
    }
  };

  const refresh = () => {
    setPage(1);
    fetchLeaderboard(1, true);
  };

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
