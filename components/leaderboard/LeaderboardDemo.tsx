"use client";

import { LeaderboardRow } from "./LeaderboardRow";
import { LeaderboardEntry } from "@/app/services/types";

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Alice Builder",
    pfp: "https://github.com/shadcn.png",
    score: 12500,
    rewards: "25.4K",
    id: "alice-1",
    talent_protocol_id: "101",
  },
  {
    rank: 2,
    name: "Bob Creator",
    pfp: "https://github.com/vercel.png",
    score: 11200,
    rewards: "18.7K",
    id: "bob-2",
    talent_protocol_id: "102",
  },
  {
    rank: 3,
    name: "Charlie Dev",
    pfp: "https://github.com/microsoft.png",
    score: 9800,
    rewards: "15.2K",
    id: "charlie-3",
    talent_protocol_id: "103",
  },
  {
    rank: 4,
    name: "Diana Designer",
    score: 8500,
    rewards: "12.1K",
    id: "diana-4",
    talent_protocol_id: "104",
  },
  {
    rank: 5,
    name: "Eve Engineer",
    score: 7200,
    rewards: "9.8K",
    id: "eve-5",
    talent_protocol_id: "105",
  },
];

export function LeaderboardDemo() {
  const handleRowClick = (entry: LeaderboardEntry) => {
    console.log("Clicked on:", entry.name);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold mb-4">Leaderboard Demo</h2>
      {mockLeaderboardData.map((entry) => (
        <LeaderboardRow key={entry.id} entry={entry} onClick={handleRowClick} />
      ))}
    </div>
  );
}
