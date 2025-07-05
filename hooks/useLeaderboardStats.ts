"use client";

import { useState, useEffect } from "react";

interface LeaderboardStats {
  totalCreators: number;
  averageScore: number;
  topScore: number;
  totalRewards: string;
  activeCreators: number;
}

interface UseLeaderboardStatsReturn {
  data: LeaderboardStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useLeaderboardStats(): UseLeaderboardStatsReturn {
  const [data, setData] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call to leaderboard service
      // For now, simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockStats: LeaderboardStats = {
        totalCreators: 1247,
        averageScore: 5420,
        topScore: 15670,
        totalRewards: "2.3M",
        activeCreators: 892,
      };

      setData(mockStats);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch leaderboard stats",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refresh = () => {
    fetchStats();
  };

  return {
    data,
    loading,
    error,
    refresh,
  };
}
