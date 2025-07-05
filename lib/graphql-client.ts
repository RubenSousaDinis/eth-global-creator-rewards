import { GraphQLClient } from "graphql-request";

// The Graph Paragraph subgraph endpoint
const PARAGRAPH_SUBGRAPH_URL =
  "https://gateway.thegraph.com/api/subgraphs/id/2NRoYArDZ2vMq3o2Gos4h1aRX6byfVM15w6XqAK374F7";

// Server-side GraphQL client (only used in API routes)
export const serverGraphqlClient = new GraphQLClient(PARAGRAPH_SUBGRAPH_URL, {
  headers: {
    "Content-Type": "application/json",
    ...(process.env.THE_GRAPH_API_KEY && {
      Authorization: `Bearer ${process.env.THE_GRAPH_API_KEY}`
    })
  }
});
