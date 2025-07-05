import { useState, useEffect, useCallback } from "react";

export function useHumanityVerification(userAddress?: string) {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkVerification = useCallback(async () => {
    if (!userAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if user has completed Self verification
      // This would typically involve checking against a verification database
      // For now, we'll check localStorage as a simple implementation
      const verificationKey = `self_verification_${userAddress}`;
      const isVerified = localStorage.getItem(verificationKey) === "true";

      setIsVerified(isVerified);
    } catch (err) {
      console.error("Error checking humanity verification:", err);
      setError(err instanceof Error ? err.message : "Failed to check verification");
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    checkVerification();
  }, [checkVerification]);

  return { isVerified, loading, error, refetch: checkVerification };
}
