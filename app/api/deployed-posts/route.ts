import { NextRequest, NextResponse } from "next/server";
import { serverGraphqlClient, mirrorGraphqlClient } from "@/lib/graphql-client";
import {
  GET_DEPLOYED_POSTS_BY_WALLET,
  DeployedPostsResponse,
  GET_MIRROR_POSTS_BY_WALLET,
  MirrorPostsResponse
} from "@/lib/queries";
import { getAllWalletAddressesForTalentProfile } from "@/lib/wallet-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const talentIdentifier = searchParams.get("talentIdentifier") || searchParams.get("walletAddress");

    if (!talentIdentifier) {
      return NextResponse.json({ error: "Talent identifier is required" }, { status: 400 });
    }

    console.log("talentIdentifier", talentIdentifier);

    // Get all wallet addresses for the talent profile
    const walletData = await getAllWalletAddressesForTalentProfile(talentIdentifier);

    if (walletData.error) {
      return NextResponse.json({ error: walletData.error }, { status: 400 });
    }

    if (walletData.addresses.length === 0) {
      return NextResponse.json({
        contractDeployeds: [],
        paragraphCount: 0,
        mirrorCount: 0,
        message: "No wallet addresses found for this talent profile"
      });
    }

    console.log("Found wallet addresses:", walletData.addresses);

    // Query both subgraphs for all wallet addresses in parallel
    const allParagraphPosts = [];
    const allMirrorPosts = [];

    // Query all wallet addresses in parallel
    const allQueries = walletData.addresses.flatMap(walletAddress => [
      serverGraphqlClient.request<DeployedPostsResponse>(GET_DEPLOYED_POSTS_BY_WALLET, {
        walletAddress
      }),
      mirrorGraphqlClient.request<MirrorPostsResponse>(GET_MIRROR_POSTS_BY_WALLET, {
        walletAddress
      })
    ]);

    const results = await Promise.allSettled(allQueries);

    // Process results - every two results belong to one wallet address
    for (let i = 0; i < results.length; i += 2) {
      const paragraphResult = results[i];
      const mirrorResult = results[i + 1];

      if (paragraphResult.status === "fulfilled") {
        const paragraphResponse = paragraphResult.value as DeployedPostsResponse;
        allParagraphPosts.push(...paragraphResponse.contractDeployeds);
      } else {
        console.error("Error fetching paragraph posts:", paragraphResult.reason);
      }

      if (mirrorResult.status === "fulfilled") {
        const mirrorResponse = mirrorResult.value as MirrorPostsResponse;
        allMirrorPosts.push(...mirrorResponse.clones);
      } else {
        console.error("Error fetching mirror posts:", mirrorResult.reason);
      }
    }

    // Use the aggregated results
    const paragraphPosts = allParagraphPosts;
    const mirrorPosts = allMirrorPosts;

    // Transform mirror posts to match the expected format
    const transformedMirrorPosts = mirrorPosts.map(post => ({
      id: post.id,
      name: `Mirror Post ${post.clone.slice(0, 6)}...${post.clone.slice(-4)}`,
      symbol: "MIRROR",
      owner: post.owner,
      postId: post.id,
      priceWei: "0",
      maxSupply: "0",
      clone: post.clone,
      blockTimestamp: post.blockTimestamp,
      blockNumber: post.blockNumber,
      transactionHash: post.transactionHash,
      type: "mirror" as const
    }));

    // Add type annotation to paragraph posts
    const typedParagraphPosts = paragraphPosts.map(post => ({
      ...post,
      type: "paragraph" as const
    }));

    // Combine and sort all posts by timestamp (newest first)
    const allPosts = [...typedParagraphPosts, ...transformedMirrorPosts].sort(
      (a, b) => parseInt(b.blockTimestamp) - parseInt(a.blockTimestamp)
    );

    return NextResponse.json({
      contractDeployeds: allPosts,
      paragraphCount: paragraphPosts.length,
      mirrorCount: mirrorPosts.length
    });
  } catch (error) {
    console.error("Error fetching deployed posts:", error);

    return NextResponse.json({ error: "Failed to fetch deployed posts" }, { status: 500 });
  }
}
