"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserNavigation } from "@/hooks/useUserNavigation";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export default function App() {
  const router = useRouter();
  const { canonical, user } = useUserNavigation();

  useEffect(() => {
    if (canonical) {
      // Redirect to user's profile page
      router.replace(`/${canonical}`);
    }
  }, [canonical, router]);

  // Show loading while redirecting if we have a user
  if (user && canonical) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <p className="text-xl text-muted-foreground">Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  // Show authentication UI if no user
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Creator Score</h1>
        <p className="text-xl text-muted-foreground">Connect your wallet to view your creator profile and score</p>
        <div className="flex justify-center pt-4">
          <DynamicWidget />
        </div>
      </div>
    </div>
  );
}
