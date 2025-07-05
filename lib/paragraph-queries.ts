import { gql } from "graphql-request";

// Query to get all deployed paragraph posts by wallet address
export const GET_DEPLOYED_POSTS_BY_WALLET = gql`
  query GetDeployedPostsByWallet($walletAddress: Bytes!) {
    contractDeployeds(where: { owner: $walletAddress }, orderBy: blockTimestamp, orderDirection: desc) {
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

// TypeScript interface for the response
export interface DeployedPost {
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

export interface DeployedPostsResponse {
  contractDeployeds: DeployedPost[];
}
