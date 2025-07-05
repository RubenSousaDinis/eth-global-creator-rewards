"use client";

import { useState } from "react";
import Image from "next/image";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Original Radix UI Avatar components for backwards compatibility
const BaseAvatar = AvatarPrimitive.Root;
const AvatarImage = AvatarPrimitive.Image;
const AvatarFallback = AvatarPrimitive.Fallback;

// Enhanced Avatar with loading states (main export)
interface AvatarProps {
  src?: string;
  fallback: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  alt?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const sizePx = {
  sm: 24,
  md: 32,
  lg: 48,
};

const Avatar = ({
  src,
  fallback,
  className,
  size = "md",
  alt,
}: AvatarProps) => {
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);

  // If no src provided, show fallback immediately
  if (!src) {
    return (
      <BaseAvatar
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          className,
        )}
      >
        <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium">
          {fallback}
        </AvatarFallback>
      </BaseAvatar>
    );
  }

  // If image failed to load, show fallback
  if (hasError) {
    return (
      <BaseAvatar
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          className,
        )}
      >
        <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium">
          {fallback}
        </AvatarFallback>
      </BaseAvatar>
    );
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Loading skeleton */}
      {isLoading && <Skeleton className="absolute inset-0 rounded-full z-10" />}

      {/* Optimized image */}
      <BaseAvatar
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          isLoading && "opacity-0",
        )}
      >
        <Image
          src={src}
          alt={alt || `${fallback} avatar`}
          width={sizePx[size]}
          height={sizePx[size]}
          className="aspect-square h-full w-full rounded-full object-cover"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          priority={size === "lg"}
          unoptimized
        />
        <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium">
          {fallback}
        </AvatarFallback>
      </BaseAvatar>
    </div>
  );
};

export { Avatar, AvatarImage, AvatarFallback };
