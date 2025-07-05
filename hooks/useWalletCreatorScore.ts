"use client";

import { useState, useEffect } from "react";
import { getCreatorScore } from "@/app/services/scoresService";
import { filterEthAddresses, getCachedData, setCachedData, CACHE_DURATIONS } from "@/lib/utils";

export function useWalletCreatorScore(walletAddress?: string) {
  const [creatorScore, setCreatorScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCreatorScore() {
      if (!walletAddress) {
        setCreatorScore(null);
        setLoading(false);
        return;
      }

      const cacheKey = `wallet_creator_score_${walletAddress}`;

      // Check cache first
      const cachedScore = getCachedData<number>(cacheKey, CACHE_DURATIONS.SCORE_BREAKDOWN);
      if (cachedScore !== null) {
        setCreatorScore(cachedScore);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Filter to ensure we have valid ETH addresses
        const addresses = filterEthAddresses([walletAddress]);

        if (addresses.length > 0) {
          const scoreData = await getCreatorScore(addresses);
          const score = scoreData.score ?? 0;
          setCreatorScore(score);

          // Cache the score
          setCachedData(cacheKey, score);
        } else {
          setCreatorScore(0);
          setCachedData(cacheKey, 0);
        }
      } catch (err) {
        console.error("Error fetching wallet creator score:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch creator score");
        setCreatorScore(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCreatorScore();
  }, [walletAddress]);

  return { creatorScore, loading, error };
}
