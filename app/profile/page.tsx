"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserNavigation } from "@/hooks/useUserNavigation";

export default function ProfilePage() {
  const { user, primaryWallet, setShowAuthFlow } = useDynamicContext();
  const router = useRouter();
  const { canonical } = useUserNavigation();

  // Check if user is logged in (either connected or authenticated)
  const isLoggedIn = !!(primaryWallet || user);

  useEffect(() => {
    if (!isLoggedIn) {
      // If not logged in, show auth modal
      setShowAuthFlow(true);
    } else if (canonical && canonical !== "profile") {
      // If logged in and we have a canonical identifier, redirect to it
      router.replace(`/${canonical}`);
    }
  }, [isLoggedIn, canonical, setShowAuthFlow, router]);

  // Show loading while we determine the redirect
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <p className="text-xl text-muted-foreground">
          {isLoggedIn ? "Loading your profile..." : "Please connect your wallet to view your profile"}
        </p>
      </div>
    </div>
  );
}
