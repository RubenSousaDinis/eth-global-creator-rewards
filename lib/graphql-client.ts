import { GraphQLClient } from "graphql-request";

// The Graph Paragraph subgraph endpoint
const PARAGRAPH_SUBGRAPH_URL =
  "https://gateway.thegraph.com/api/subgraphs/id/2NRoYArDZ2vMq3o2Gos4h1aRX6byfVM15w6XqAK374F7";

// Mirror posts subgraph endpoint
const MIRROR_SUBGRAPH_URL =
  "https://gateway.thegraph.com/api/subgraphs/id/EHwa9hAintVCNNa3Esk82JQUydaHvbc6RECqMUVR2vwc";

// Server-side GraphQL client (only used in API routes)
export const serverGraphqlClient = new GraphQLClient(PARAGRAPH_SUBGRAPH_URL, {
  headers: {
    "Content-Type": "application/json",
    ...(process.env.THE_GRAPH_API_KEY && {
      Authorization: `Bearer ${process.env.THE_GRAPH_API_KEY}`
    })
  }
});

// Mirror posts GraphQL client
export const mirrorGraphqlClient = new GraphQLClient(MIRROR_SUBGRAPH_URL, {
  headers: {
    "Content-Type": "application/json",
    ...(process.env.THE_GRAPH_API_KEY && {
      Authorization: `Bearer ${process.env.THE_GRAPH_API_KEY}`
    })
  }
});
