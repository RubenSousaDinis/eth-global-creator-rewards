import { NextRequest, NextResponse } from "next/server";
import { serverGraphqlClient, mirrorGraphqlClient } from "@/lib/graphql-client";
import { gql } from "graphql-request";

// Types for the GraphQL responses
interface ParagraphPost {
  id: string;
  name: string;
  symbol: string;
  owner: string;
  postId: string;
  priceWei: string;
  maxSupply: string;
  clone: string;
  blockTimestamp: string;
  blockNumber: string;
  transactionHash: string;
}

interface MirrorPost {
  id: string;
  clone: string;
  owner: string;
  blockTimestamp: string;
  blockNumber: string;
  transactionHash: string;
}

interface ParagraphPostsResponse {
  contractDeployeds: ParagraphPost[];
}

interface MirrorPostsResponse {
  clones: MirrorPost[];
}

// GraphQL queries to get latest posts from both platforms
const GET_LATEST_PARAGRAPH_POSTS = gql`
  query GetLatestParagraphPosts($limit: Int!) {
    contractDeployeds(first: $limit, orderBy: blockTimestamp, orderDirection: desc) {
      id
      name
      symbol
      owner
      postId
      priceWei
      maxSupply
      clone
      blockTimestamp
      blockNumber
      transactionHash
    }
  }
`;

const GET_LATEST_MIRROR_POSTS = gql`
  query GetLatestMirrorPosts($limit: Int!) {
    clones(first: $limit, orderBy: blockTimestamp, orderDirection: desc) {
      id
      clone
      owner
      blockTimestamp
      blockNumber
      transactionHash
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    // Debug: Check if API key is available
    console.log("THE_GRAPH_API_KEY is set:", !!process.env.THE_GRAPH_API_KEY);

    // Fetch latest posts from both platforms in parallel
    const [paragraphResult, mirrorResult] = await Promise.allSettled([
      serverGraphqlClient.request<ParagraphPostsResponse>(GET_LATEST_PARAGRAPH_POSTS, { limit }),
      mirrorGraphqlClient.request<MirrorPostsResponse>(GET_LATEST_MIRROR_POSTS, { limit })
    ]);

    // Handle GraphQL errors gracefully
    if (paragraphResult.status === "rejected") {
      console.error("Paragraph GraphQL error:", paragraphResult.reason);
    }
    if (mirrorResult.status === "rejected") {
      console.error("Mirror GraphQL error:", mirrorResult.reason);
    }

    const paragraphPosts = paragraphResult.status === "fulfilled" ? paragraphResult.value.contractDeployeds : [];
    const mirrorPosts = mirrorResult.status === "fulfilled" ? mirrorResult.value.clones : [];

    // Log warning if Paragraph posts are unavailable due to missing API key
    if (paragraphResult.status === "rejected" && paragraphPosts.length === 0) {
      console.warn("Paragraph posts unavailable. Check THE_GRAPH_API_KEY environment variable.");
    }

    // Transform mirror posts to match the expected format
    const transformedMirrorPosts = mirrorPosts.map((post: any) => ({
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
    const typedParagraphPosts = paragraphPosts.map((post: any) => ({
      ...post,
      type: "paragraph" as const
    }));

    // Combine and sort all posts by timestamp (newest first)
    const allPosts = [...typedParagraphPosts, ...transformedMirrorPosts]
      .sort((a, b) => parseInt(b.blockTimestamp) - parseInt(a.blockTimestamp))
      .slice(0, limit * 2);

    return NextResponse.json({
      posts: allPosts,
      paragraphCount: paragraphPosts.length,
      mirrorCount: mirrorPosts.length,
      totalCount: allPosts.length
    });
  } catch (error) {
    console.error("Error fetching feed posts:", error);
    return NextResponse.json({ error: "Failed to fetch feed posts" }, { status: 500 });
  }
}
