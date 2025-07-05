import { useState, useEffect } from "react";
import { getENSTextRecords } from "@/lib/ens-service";

export function useENSVerification(ensName?: string) {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkENSVerification() {
      if (!ensName) {
        setLoading(false);
        setIsVerified(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const records = await getENSTextRecords(ensName);

        // Consider verified if they have both creator score and humanity verification records
        const hasCreatorScore = records.creatorScore !== null && records.creatorScore !== "";
        const hasHumanityVerification = records.humanityVerified === "true";

        setIsVerified(hasCreatorScore && hasHumanityVerification);
      } catch (err) {
        console.error("Error checking ENS verification:", err);
        setError(err instanceof Error ? err.message : "Failed to check ENS verification");
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    }

    checkENSVerification();
  }, [ensName]);

  return { isVerified, loading, error };
}
