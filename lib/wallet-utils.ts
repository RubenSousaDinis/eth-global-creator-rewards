import { resolveTalentUser } from "./user-resolver";

export interface TalentProfileWallets {
  addresses: string[];
  primaryAddress: string | null;
  error?: string;
}

/**
 * Gets all wallet addresses associated with a talent profile
 * This combines wallet addresses from both Talent Protocol and Farcaster
 */
export async function getAllWalletAddressesForTalentProfile(talentIdentifier: string): Promise<TalentProfileWallets> {
  try {
    // First resolve the talent user to get basic profile info
    const talentUser = await resolveTalentUser(talentIdentifier);

    if (!talentUser) {
      return {
        addresses: [],
        primaryAddress: null,
        error: "Talent profile not found"
      };
    }

    const addresses = new Set<string>();
    let primaryAddress = null;

    // Add wallet address from talent profile if available
    if (talentUser.wallet && talentUser.wallet.startsWith("0x")) {
      addresses.add(talentUser.wallet);
      primaryAddress = talentUser.wallet;
    }

    // Get additional wallet addresses from Farcaster if FID is available
    if (talentUser.fid) {
      try {
        // Use the full URL for server-side calls
        const baseUrl = process.env.NEXT_PUBLIC_URL || `http://localhost:3000`;
        const farcasterResponse = await fetch(`${baseUrl}/api/farcaster-wallets?fid=${talentUser.fid}`);

        if (farcasterResponse.ok) {
          const farcasterData = await farcasterResponse.json();

          // Add all addresses from Farcaster
          if (farcasterData.addresses && Array.isArray(farcasterData.addresses)) {
            farcasterData.addresses.forEach((addr: string) => {
              if (addr && addr.startsWith("0x")) {
                addresses.add(addr);
              }
            });
          }

          // Set primary address if not already set
          if (!primaryAddress && farcasterData.primaryEthAddress) {
            primaryAddress = farcasterData.primaryEthAddress;
          }
        }
      } catch (error) {
        console.warn("Error fetching Farcaster wallet addresses:", error);
      }
    }

    const addressArray = Array.from(addresses);

    return {
      addresses: addressArray,
      primaryAddress: primaryAddress || (addressArray.length > 0 ? addressArray[0] : null)
    };
  } catch (error) {
    console.error("Error getting wallet addresses for talent profile:", error);
    return {
      addresses: [],
      primaryAddress: null,
      error: error instanceof Error ? error.message : "Failed to fetch wallet addresses"
    };
  }
}
