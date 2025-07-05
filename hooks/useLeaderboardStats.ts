"use client";

import { useState, useEffect } from "react";
import { getLeaderboardStats } from "@/app/services/leaderboardService";

interface LeaderboardStats {
  minScore: number | null;
  totalCreators: number;
}

interface UseLeaderboardStatsReturn {
  data: LeaderboardStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cache: { data: LeaderboardStats; timestamp: number } | null = null;

export function useLeaderboardStats(): UseLeaderboardStatsReturn {
  const [data, setData] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
        setData(cache.data);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      const statsData = await getLeaderboardStats();

      // Cache the result
      cache = {
        data: statsData,
        timestamp: Date.now(),
      };

      setData(statsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch leaderboard stats",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    // Clear cache to force fresh fetch
    cache = null;
    fetchLeaderboardStats();
  };

  useEffect(() => {
    fetchLeaderboardStats();
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
