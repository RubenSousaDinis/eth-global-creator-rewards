"use client";

import { useState, useEffect } from "react";
import { getLeaderboardCreators } from "@/app/services/leaderboardService";
import { LeaderboardEntry } from "@/app/services/types";

interface UseLeaderboardParams {
  page?: number;
  perPage?: number;
}

interface UseLeaderboardReturn {
  data: LeaderboardEntry[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<
  string,
  { data: LeaderboardEntry[]; timestamp: number }
>();

export function useLeaderboard({
  page = 1,
  perPage = 10,
}: UseLeaderboardParams = {}): UseLeaderboardReturn {
  const [data, setData] = useState<LeaderboardEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `leaderboard-${page}-${perPage}`;

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      const leaderboardData = await getLeaderboardCreators({ page, perPage });

      // Cache the result
      cache.set(cacheKey, {
        data: leaderboardData,
        timestamp: Date.now(),
      });

      setData(leaderboardData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch leaderboard data",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    // Clear cache for this key to force fresh fetch
    cache.delete(cacheKey);
    fetchLeaderboardData();
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [page, perPage]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
