"use client";

import { Avatar } from "@/components/ui/avatar";
import { CheckCircle } from "lucide-react";
import { useENSVerification } from "@/hooks/useENSVerification";
import { useENSName } from "@/hooks/useENSName";
import { cn } from "@/lib/utils";

interface VerifiedAvatarProps {
  src?: string;
  fallback: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  alt?: string;
  walletAddress?: string;
  ensName?: string; // Optional override for ENS name
  showBadge?: boolean; // Allow disabling badge
}

export function VerifiedAvatar({
  src,
  fallback,
  className,
  size = "md",
  alt,
  walletAddress,
  ensName: providedEnsName,
  showBadge = true
}: VerifiedAvatarProps) {
  // Get ENS name from wallet address if not provided
  const { ensName: resolvedEnsName } = useENSName(walletAddress);
  const ensName = providedEnsName || resolvedEnsName || undefined;

  // Check verification status
  const { isVerified, loading } = useENSVerification(ensName);

  const badgeSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const badgePosition = {
    sm: "-bottom-0.5 -right-0.5",
    md: "-bottom-1 -right-1",
    lg: "-bottom-1.5 -right-1.5"
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar src={src} fallback={fallback} size={size} alt={alt} />

      {/* Verification Badge */}
      {showBadge && isVerified && !loading && (
        <div
          className={cn(
            "absolute rounded-full bg-green-500 flex items-center justify-center",
            badgeSize[size],
            badgePosition[size],
            "border-2 border-white dark:border-gray-800"
          )}
          title="Verified ENS Creator"
        >
          <CheckCircle className="h-full w-full text-white" />
        </div>
      )}
    </div>
  );
}
