import { useState, useEffect } from "react";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { addEnsContracts } from "@ensdomains/ensjs";
import { getName } from "@ensdomains/ensjs/public";

export function useENSName(address?: string) {
  const [ensName, setEnsName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchENSName() {
      if (!address) {
        setEnsName(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const client = createPublicClient({
          chain: addEnsContracts(mainnet),
          transport: http()
        });

        const result = await getName(client, {
          address: address as `0x${string}`
        });

        // Ensure we only set a string value
        if (result && typeof result === "string") {
          setEnsName(result);
        } else if (result && typeof result === "object" && "name" in result && typeof result.name === "string") {
          setEnsName(result.name);
        } else {
          setEnsName(null);
        }
      } catch (err) {
        console.error("Error fetching ENS name:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch ENS name");
        setEnsName(null);
      } finally {
        setLoading(false);
      }
    }

    fetchENSName();
  }, [address]);

  return { ensName, loading, error };
}
