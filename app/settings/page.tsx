"use client";

import { v4 as uuidv4 } from "uuid";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { countries } from "@selfxyz/core";
import { SelfQRcodeWrapper, SelfAppBuilder, type SelfApp } from "@selfxyz/qrcode";
import { useEffect, useMemo, useState } from "react";

const userId = uuidv4();

export default function SettingsPage() {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const router = useRouter();

  const isLoggedIn = !!primaryWallet;

  // Check auth on mount and redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to home and trigger login modal
      router.replace("/");
      setShowAuthFlow(true);
    }
  }, [isLoggedIn, router, setShowAuthFlow]);

  // Don't render content if not logged in
  if (!isLoggedIn) {
    return null;
  }
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const excludedCountries = useMemo(() => [countries.NORTH_KOREA, countries.IRAN], []);

  useEffect(() => {
    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: "Creator Rewards",
        scope: "creator-rewards",
        endpoint: "https://cannes.creatorscore.app/api/self-verification",
        logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
        userId: userId,
        endpointType: "staging_https",
        userIdType: "uuid",
        userDefinedData: JSON.stringify({ action: "creator-rewards" }),
        disclosures: {
          minimumAge: 18,
          nationality: true,
          gender: true,
          excludedCountries: excludedCountries
        }
      }).build();

      setSelfApp(app);
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-xl text-muted-foreground">Configure your Creator Score preferences</p>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>🚧 More settings options coming soon</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold tracking-tight pb-5">Self Verification</h2>
          {selfApp ? (
            <SelfQRcodeWrapper
              selfApp={selfApp}
              onSuccess={() => {
                console.log("Verification successful");
                // Perform actions after successful verification
              }}
              onError={() => {
                console.error("Error: Failed to verify identity");
              }}
            />
          ) : (
            <div className="w-[256px] h-[256px] bg-gray-200 animate-pulse flex items-center justify-center">
              <p className="text-gray-500 text-sm">Loading QR Code...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
