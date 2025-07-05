"use client";

import { useState, useEffect } from "react";
import { CreatorScore } from "@/app/services/types";

interface UserCreatorScoreData {
  score: CreatorScore;
  rank: number | null;
  percentile: number | null;
}

interface UseUserCreatorScoreReturn {
  data: UserCreatorScoreData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useUserCreatorScore(
  userId?: string,
): UseUserCreatorScoreReturn {
  const [data, setData] = useState<UserCreatorScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserScore = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        setData(null);
        return;
      }

      // TODO: Replace with actual API call to user score service
      // For now, simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 600));

      const mockScore: UserCreatorScoreData = {
        score: {
          score: 8750,
          level: 4,
          levelName: "Advanced Creator",
          lastCalculatedAt: new Date().toISOString(),
          walletAddress: "0x123...abc",
        },
        rank: 42,
        percentile: 85.2,
      };

      setData(mockScore);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch user creator score",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserScore();
  }, [userId]);

  const refresh = () => {
    fetchUserScore();
  };

  return {
    data,
    loading,
    error,
    refresh,
  };
}
