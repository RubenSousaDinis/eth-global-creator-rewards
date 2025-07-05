import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Create a public client for Base network
const publicClient = createPublicClient({
  chain: base,
  transport: http()
});

// ABI for the contractURI function
const CONTRACT_URI_ABI = [
  {
    type: "function",
    name: "contractURI",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view"
  }
] as const;

// ABI for the description function (used by Mirror posts)
const DESCRIPTION_ABI = [
  {
    type: "function",
    name: "description",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view"
  }
] as const;

// Function to get contract URI from a contract address
export async function getContractURI(contractAddress: string): Promise<string | null> {
  try {
    const contractURI = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACT_URI_ABI,
      functionName: "contractURI"
    });

    return contractURI;
  } catch (error) {
    console.error("Error fetching contractURI:", error);
    return null;
  }
}

// Function to get description from a contract address (used by Mirror posts)
export async function getContractDescription(contractAddress: string): Promise<string | null> {
  try {
    const description = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: DESCRIPTION_ABI,
      functionName: "description"
    });

    return description;
  } catch (error) {
    console.error("Error fetching description:", error);
    return null;
  }
}

// Function to fetch and parse metadata from URI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getContractMetadata(uri: string): Promise<any> {
  console.log("uri", uri);
  try {
    // Replace paragraph.xyz with paragraph.com
    const updatedUri = uri.replace("paragraph.xyz", "paragraph.com");
    console.log("updated uri", updatedUri);

    // Handle IPFS URLs
    if (updatedUri.startsWith("ipfs://")) {
      const ipfsHash = updatedUri.replace("ipfs://", "");
      const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
      return await response.json();
    }

    // Handle HTTP URLs
    if (updatedUri.startsWith("http")) {
      const response = await fetch(updatedUri);
      return await response.json();
    }

    // Handle data URLs
    if (updatedUri.startsWith("data:")) {
      const base64Data = updatedUri.split(",")[1];
      const jsonString = atob(base64Data);
      return JSON.parse(jsonString);
    }

    return null;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return null;
  }
}

// Function to extract origin URL from metadata
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractOriginUrl(metadata: any): string | null {
  if (!metadata) return null;

  // Common fields where origin URL might be stored
  const possibleFields = [
    "origin_url",
    "originUrl",
    "external_url",
    "externalUrl",
    "external_link",
    "url",
    "link",
    "source",
    "original_url"
  ];

  for (const field of possibleFields) {
    if (metadata[field] && typeof metadata[field] === "string") {
      return metadata[field];
    }
  }

  // Check if it's in attributes array
  if (metadata.attributes && Array.isArray(metadata.attributes)) {
    for (const attr of metadata.attributes) {
      if (attr.trait_type === "origin_url" || attr.trait_type === "external_url") {
        return attr.value;
      }
    }
  }

  return null;
}

// Combined function to get Paragraph post URL from contract address
export async function getParagraphPostUrl(contractAddress: string): Promise<string | null> {
  const contractURI = await getContractURI(contractAddress);
  if (!contractURI) return null;

  const metadata = await getContractMetadata(contractURI);
  if (!metadata) return null;

  // Extract the external_link field from the metadata
  return metadata.external_link || null;
}

// Combined function to get Mirror post URL from contract address
export async function getMirrorPostUrl(contractAddress: string): Promise<string | null> {
  const description = await getContractDescription(contractAddress);
  return description;
}

// Generic function to get post URL based on post type
export async function getPostUrl(contractAddress: string, postType: "paragraph" | "mirror"): Promise<string | null> {
  if (postType === "mirror") {
    return await getMirrorPostUrl(contractAddress);
  } else {
    return await getParagraphPostUrl(contractAddress);
  }
}
