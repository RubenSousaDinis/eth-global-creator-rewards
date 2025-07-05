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
 * Simplified: Dynamic only provides wallet address via connection (no signing required)
 */
export function getUserContext(
  farcasterContext: { user?: FarcasterUserContext } | null,
  dynamicPrimaryWallet: unknown,
  isConnected: boolean
): UnifiedUserContext | undefined {
  // Dev mode: Return hardcoded wallet address
  if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
    return {
      wallet: "0x58A35cF59d5C630c057aF008a78bc67CDc2EC094",
      source: "dynamic"
    };
  }

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

  // Priority 2: Dynamic context (when wallet is connected - no signing required)
  // Just extract wallet address - let Talent API handle the rest
  if (dynamicPrimaryWallet && isConnected) {
    let walletAddress: string | undefined;

    // Handle different input types
    if (typeof dynamicPrimaryWallet === "string") {
      walletAddress = dynamicPrimaryWallet;
    } else {
      walletAddress = extractWalletAddress(dynamicPrimaryWallet);
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
  const { primaryWallet } = useDynamicContext();

  return getUserContext(null, primaryWallet, !!primaryWallet);
}
