"use client";

import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { getUserContext } from "@/lib/user-context";
import { CreatorScore } from "@/app/services/types";

interface UseUserCreatorScoreReturn {
  data: CreatorScore | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes (scores are expensive to compute)
const cache = new Map<string, { data: CreatorScore; timestamp: number }>();

export function useUserCreatorScore(): UseUserCreatorScoreReturn {
  const [data, setData] = useState<CreatorScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { context } = useMiniKit();
  const user = getUserContext(context);
  const userFid = user?.fid;

  const fetchUserScore = async () => {
    if (!userFid) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cacheKey = `creator-score-${userFid}`;

      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      // Fetch fresh data from API
      const response = await fetch(
        `/api/talent-score?fid=${userFid}&scorer=creator_score`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch creator score: ${response.status}`);
      }

      const scoreData = await response.json();

      // Cache the result
      cache.set(cacheKey, {
        data: scoreData,
        timestamp: Date.now(),
      });

      setData(scoreData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch creator score",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    if (userFid) {
      // Clear cache for this user to force fresh fetch
      cache.delete(`creator-score-${userFid}`);
      fetchUserScore();
    }
  };

  useEffect(() => {
    fetchUserScore();
  }, [userFid]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
