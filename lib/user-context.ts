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
 * Get unified user context from both Farcaster and Dynamic sources
 */
export function getUserContext(
  farcasterContext: { user?: FarcasterUserContext } | null,
  dynamicWalletOrUser: any,
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

    // Handle different Dynamic object structures
    if (dynamicWalletOrUser.address) {
      walletAddress = dynamicWalletOrUser.address;
    } else if (dynamicWalletOrUser.publicKey) {
      walletAddress = dynamicWalletOrUser.publicKey;
    } else if (typeof dynamicWalletOrUser === "string") {
      walletAddress = dynamicWalletOrUser;
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
