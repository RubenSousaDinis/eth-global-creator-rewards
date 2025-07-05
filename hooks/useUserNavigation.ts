"use client";

import { useMemo } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getUserContext, type UnifiedUserContext } from "@/lib/user-context";
import { User, Trophy, Settings } from "lucide-react";

export function useUserNavigation() {
  const { context } = useMiniKit();
  const { primaryWallet } = useDynamicContext();

  // Get unified user context (memoized to prevent unnecessary re-computations)
  const user: UnifiedUserContext | undefined = useMemo(() => {
    return getUserContext(context, primaryWallet, !!primaryWallet);
  }, [context, primaryWallet]);

  // Determine canonical identifier for routing (memoized)
  const canonical = useMemo(() => {
    return user?.username || user?.fid?.toString() || user?.wallet;
  }, [user]);

  // Navigation items are ALWAYS enabled - auth is handled at the click level
  const navItems = useMemo(
    () => [
      {
        href: canonical ? `/${canonical}` : "/profile",
        icon: User,
        label: "Profile",
        disabled: false,
        requiresAuth: true // Flag to indicate this needs auth
      },
      {
        href: "/leaderboard",
        icon: Trophy,
        label: "Leaderboard",
        disabled: false,
        requiresAuth: false
      },
      {
        href: "/settings",
        icon: Settings,
        label: "Settings",
        disabled: false,
        requiresAuth: true // Flag to indicate this needs auth
      }
    ],
    [canonical]
  );

  return { navItems, canonical, user };
}
