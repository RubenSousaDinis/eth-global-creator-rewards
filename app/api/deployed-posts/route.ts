import { NextRequest, NextResponse } from "next/server";
import { serverGraphqlClient } from "@/lib/graphql-client";
import { GET_DEPLOYED_POSTS_BY_WALLET, DeployedPostsResponse } from "@/lib/paragraph-queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    console.log("walletAddress", walletAddress);
    // Validate wallet address format (basic check)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 });
    }

    // Query The Graph subgraph
    const data = await serverGraphqlClient.request<DeployedPostsResponse>(GET_DEPLOYED_POSTS_BY_WALLET, {
      walletAddress
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching deployed posts:", error);

    return NextResponse.json({ error: "Failed to fetch deployed posts" }, { status: 500 });
  }
}
