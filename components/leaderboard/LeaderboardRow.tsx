"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatK } from "@/lib/utils";
import { LeaderboardEntry } from "@/app/services/types";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  onClick?: (entry: LeaderboardEntry) => void;
}

export function LeaderboardRow({ entry, onClick }: LeaderboardRowProps) {
  const { rank, name, pfp, score, rewards, id } = entry;

  const handleClick = () => {
    if (onClick) {
      onClick(entry);
    }
  };

  // Format rank with appropriate styling
  const getRankDisplay = (rank: number) => {
    if (rank <= 3) {
      const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
      return medals[rank as keyof typeof medals];
    }
    return `#${rank}`;
  };

  // Get rank styling
  const getRankStyling = (rank: number) => {
    if (rank <= 3) {
      return "text-2xl font-bold";
    }
    return "text-sm font-medium text-muted-foreground";
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        onClick ? "cursor-pointer hover:bg-muted/50" : ""
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className={`w-12 text-center ${getRankStyling(rank)}`}>
            {getRankDisplay(rank)}
          </div>

          {/* Avatar */}
          <Avatar className="h-12 w-12">
            <AvatarImage src={pfp} alt={name} />
            <AvatarFallback className="text-sm font-medium">
              {name?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          {/* Name and Score */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm truncate">{name}</h3>
              <Badge variant="secondary" className="text-xs">
                {formatK(score)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {rewards} rewards
            </p>
          </div>

          {/* Score (larger display) */}
          <div className="text-right">
            <div className="text-lg font-bold">{formatK(score)}</div>
            <div className="text-xs text-muted-foreground">score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
