import { getLeaderboardCreators } from "../../services/leaderboardService";
import fetchMock from "jest-fetch-mock";
import { LeaderboardEntry } from "@/app/services/types";

describe("Leaderboard Service", () => {
  describe("getLeaderboardCreators", () => {
    beforeEach(() => {
      fetchMock.resetMocks();
    });

    it("successfully fetches leaderboard creators", async () => {
      const mockEntries: LeaderboardEntry[] = [
        { id: "1", rank: 1, name: "Alice", pfp: "AlicePFP", score: 100, rewards: "Base,Celo", talent_protocol_id: "1" },
        { id: "2", rank: 2, name: "Bob", pfp: "BobPFP", score: 100, rewards: "Base", talent_protocol_id: "2" }
      ];

      fetchMock.mockResponseOnce(JSON.stringify({ entries: mockEntries }));

      const result = await getLeaderboardCreators({ page: 2, perPage: 5 });

      expect(fetchMock).toHaveBeenCalledWith("/api/leaderboard?page=2&per_page=5");
      expect(result).toEqual(mockEntries);
    });

    it("throws an error on failed fetch", async () => {
      fetchMock.mockResponseOnce("Internal Server Error", { status: 500 });

      await expect(getLeaderboardCreators()).rejects.toThrow("Internal Server Error");
    });

    it("throws generic error if no error text is returned", async () => {
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(getLeaderboardCreators()).rejects.toThrow("Failed to fetch leaderboard data");
    });
  });
});
