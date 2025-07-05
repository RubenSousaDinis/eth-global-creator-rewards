"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useUserNavigation } from "@/hooks/useUserNavigation";
// import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export default function App() {
  const router = useRouter();
  // const { canonical, user } = useUserNavigation();

  useEffect(() => {
    // Always redirect to leaderboard
    router.replace("/leaderboard");
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <p className="text-xl text-muted-foreground">Redirecting to leaderboard...</p>
      </div>
    </div>
  );
}
