import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

// Define the type locally since it's not exported from the MiniKit SDK
type FarcasterUserContext = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

// Unified user context that supports both Farcaster and Dynamic
export type UnifiedUserContext = {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  wallet?: string;
  source: "farcaster" | "dynamic";
};

/**
 * Detects if the app is running inside a Farcaster MiniApp
 */
function isFarcasterEnvironment(): boolean {
  if (typeof window === "undefined") return false;

  // Check for Farcaster-specific user agent or other indicators
  const userAgent = window.navigator.userAgent;
  return userAgent.includes("Farcaster") || userAgent.includes("fc_mobile") || userAgent.includes("warpcast");
}

/**
 * Type guard to check if object has address property
 */
function hasAddress(obj: unknown): obj is { address: string } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "address" in obj &&
    typeof (obj as Record<string, unknown>).address === "string"
  );
}

/**
 * Extract wallet address from Dynamic user/wallet object
 */
function extractWalletAddress(obj: unknown): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;

  const typedObj = obj as Record<string, unknown>;

  // Try different property paths where wallet address might be stored
  if (hasAddress(typedObj)) {
    return typedObj.address;
  }

  if (typeof typedObj.publicKey === "string") {
    return typedObj.publicKey;
  }

  if (typeof typedObj.walletPublicKey === "string") {
    return typedObj.walletPublicKey;
  }

  // Check verifiedCredentials array
  if (Array.isArray(typedObj.verifiedCredentials) && typedObj.verifiedCredentials.length > 0) {
    const firstCredential = typedObj.verifiedCredentials[0];
    if (hasAddress(firstCredential)) {
      return firstCredential.address;
    }
  }

  return undefined;
}

/**
 * Get unified user context from both Farcaster and Dynamic sources
 */
export function getUserContext(
  farcasterContext: { user?: FarcasterUserContext } | null,
  dynamicWalletOrUser: unknown,
  isDynamicAuthenticated: boolean
): UnifiedUserContext | undefined {
  // Priority 1: Farcaster context (when in Farcaster environment)
  if (farcasterContext?.user && isFarcasterEnvironment()) {
    return {
      fid: farcasterContext.user.fid,
      username: farcasterContext.user.username,
      displayName: farcasterContext.user.displayName,
      pfpUrl: farcasterContext.user.pfpUrl,
      source: "farcaster"
    };
  }

  // Priority 2: Dynamic context (when authenticated)
  if (isDynamicAuthenticated && dynamicWalletOrUser) {
    let walletAddress: string | undefined;

    // Handle different input types
    if (typeof dynamicWalletOrUser === "string") {
      walletAddress = dynamicWalletOrUser;
    } else {
      walletAddress = extractWalletAddress(dynamicWalletOrUser);
    }

    if (walletAddress) {
      return {
        wallet: walletAddress,
        source: "dynamic"
      };
    }
  }

  return undefined;
}

/**
 * React hook to get unified user context
 */
export function useUnifiedUserContext(): UnifiedUserContext | undefined {
  const { user: dynamicUser } = useDynamicContext();

  return getUserContext(null, dynamicUser, !!dynamicUser);
}
