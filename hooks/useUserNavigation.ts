"use client";

import { useMemo } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getUserContext, type UnifiedUserContext } from "@/lib/user-context";
import { User, Trophy, Settings } from "lucide-react";

export function useUserNavigation() {
  const { context } = useMiniKit();
  const { user: dynamicUser, primaryWallet } = useDynamicContext();

  // Get unified user context (memoized to prevent unnecessary re-computations)
  const user: UnifiedUserContext | undefined = useMemo(() => {
    return getUserContext(context, primaryWallet || dynamicUser, !!primaryWallet);
  }, [context, primaryWallet, dynamicUser]);

  // Determine canonical identifier for routing (memoized)
  const canonical = useMemo(() => {
    return user?.username || user?.fid?.toString() || user?.wallet;
  }, [user]);

  const navItems = useMemo(
    () => [
      {
        href: canonical ? `/${canonical}` : undefined,
        icon: User,
        label: "Profile",
        disabled: !canonical
      },
      {
        href: "/leaderboard",
        icon: Trophy,
        label: "Leaderboard",
        disabled: false
      },
      {
        href: "/settings",
        icon: Settings,
        label: "Settings",
        disabled: !canonical
      }
    ],
    [canonical]
  );

  return { navItems, canonical, user };
}
