import React from "react";
import { VerifiedAvatar } from "@/components/ui/VerifiedAvatar";
import { cn } from "@/lib/utils";

interface LeaderboardRowProps {
  rank: number;
  name: string;
  avatarUrl?: string;
  score: number;
  rewards: string; // e.g., "0.08 ETH"
  highlight?: boolean;
  walletAddress?: string; // For ENS verification
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  rank,
  name,
  avatarUrl,
  score,
  rewards,
  highlight = false,
  walletAddress
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl mb-2",
        highlight ? "bg-primary/10" : "bg-muted"
      )}
      style={{ minHeight: 56 }}
    >
      {/* Rank */}
      <div className="w-8 text-lg font-semibold text-muted-foreground flex-shrink-0 text-center">#{rank}</div>
      {/* Avatar + Name + Score */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <VerifiedAvatar fallback={name[0]} src={avatarUrl} walletAddress={walletAddress} />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold truncate leading-tight text-base">{name}</span>
          <span className="text-xs text-muted-foreground">Creator Score: {score}</span>
        </div>
      </div>
      {/* Rewards */}
      <div className="w-20 text-right font-semibold text-base text-foreground flex-shrink-0">{rewards}</div>
    </div>
  );
};
