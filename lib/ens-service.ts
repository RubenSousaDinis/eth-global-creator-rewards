import { createPublicClient, createWalletClient, custom, http } from "viem";
import { mainnet } from "viem/chains";
import { addEnsContracts } from "@ensdomains/ensjs";
import { setRecords } from "@ensdomains/ensjs/wallet";
import { getTextRecord } from "@ensdomains/ensjs/public";

// Configure ENS-enabled clients
const getPublicClient = () => {
  return createPublicClient({
    chain: addEnsContracts(mainnet),
    transport: http()
  });
};

// ENS text record keys
export const ENS_TEXT_KEYS = {
  CREATOR_SCORE: "creator.score",
  HUMANITY_VERIFIED: "humanity.verified",
  UPDATED_AT: "creator.updated"
} as const;

export interface ENSTextRecords {
  creatorScore: string | null;
  humanityVerified: string | null;
  updatedAt: string | null;
}

export interface SetENSRecordsParams {
  ensName: string;
  creatorScore: number;
  humanityVerified: boolean;
  wallet: any;
  resolverAddress?: string;
}

// Default ENS Public Resolver
const DEFAULT_RESOLVER = "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63";

/**
 * Get current ENS text records for creator data
 */
export async function getENSTextRecords(ensName: string): Promise<ENSTextRecords> {
  try {
    const client = getPublicClient();

    const [creatorScore, humanityVerified, updatedAt] = await Promise.all([
      getTextRecord(client, { name: ensName, key: ENS_TEXT_KEYS.CREATOR_SCORE }),
      getTextRecord(client, { name: ensName, key: ENS_TEXT_KEYS.HUMANITY_VERIFIED }),
      getTextRecord(client, { name: ensName, key: ENS_TEXT_KEYS.UPDATED_AT })
    ]);

    return {
      creatorScore,
      humanityVerified,
      updatedAt
    };
  } catch (error) {
    console.error("Error fetching ENS text records:", error);
    return {
      creatorScore: null,
      humanityVerified: null,
      updatedAt: null
    };
  }
}

/**
 * Check if a user is verified human (same logic as useHumanityVerification hook)
 */
export async function checkHumanityVerification(userAddress: string): Promise<boolean> {
  try {
    // Check if user has completed Self verification
    // This matches the logic from useHumanityVerification hook
    const verificationKey = `self_verification_${userAddress}`;
    const isVerified = localStorage.getItem(verificationKey) === "true";

    return isVerified;
  } catch (error) {
    console.error("Error checking humanity verification:", error);
    return false;
  }
}

/**
 * Set ENS text records for creator score and humanity verification
 * Only allows verified humans to set records
 */
export async function setENSTextRecords({
  ensName,
  creatorScore,
  humanityVerified,
  wallet,
  resolverAddress = DEFAULT_RESOLVER
}: SetENSRecordsParams): Promise<{ success: boolean; error?: string; txHash?: string }> {
  try {
    // Check if user is verified human before allowing record updates
    const isVerifiedHuman = await checkHumanityVerification(wallet.address);

    if (!isVerifiedHuman) {
      return {
        success: false,
        error: "Only verified humans can set ENS records. Please complete humanity verification first."
      };
    }

    // Try to switch to mainnet if the wallet supports it
    try {
      if (wallet.connector?.supportsNetworkSwitching()) {
        await wallet.switchNetwork(mainnet.id);
        console.log("Successfully switched to mainnet");
      }
      // If no switch method exists, the wallet will prompt the user during transaction
    } catch (switchError) {
      console.warn("Could not switch chain automatically:", switchError);
      // Continue anyway - the wallet will prompt for chain switch during transaction
    }

    // Get the provider from Dynamic Labs wallet
    const provider = await wallet.connector.getProvider();

    if (!provider) {
      return { success: false, error: "Could not get wallet provider. Please reconnect your wallet." };
    }

    const walletClient = createWalletClient({
      chain: addEnsContracts(mainnet),
      transport: custom(provider)
    });

    // Set all text records in a single transaction
    const txHash = await setRecords(walletClient, {
      name: ensName,
      account: wallet.address as `0x${string}`,
      texts: [
        {
          key: ENS_TEXT_KEYS.CREATOR_SCORE,
          value: creatorScore.toString()
        },
        {
          key: ENS_TEXT_KEYS.HUMANITY_VERIFIED,
          value: humanityVerified.toString()
        },
        {
          key: ENS_TEXT_KEYS.UPDATED_AT,
          value: new Date().toISOString()
        }
      ],
      resolverAddress: resolverAddress as `0x${string}`
    });

    return {
      success: true,
      txHash
    };
  } catch (error) {
    console.error("Error setting ENS text records:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set ENS records"
    };
  }
}

/**
 * Check if a wallet owns an ENS name
 * Note: This is a simplified check - in production you would verify ENS ownership
 */
export async function checkENSOwnership(ensName: string, walletAddress: string): Promise<boolean> {
  // For now, return true to allow the functionality
  // In a full implementation, you would use the ENS registry to check ownership
  console.log(`Checking ENS ownership for ${ensName} by ${walletAddress}`);
  return true;
}
