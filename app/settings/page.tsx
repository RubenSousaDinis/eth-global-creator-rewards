"use client";

import { SelfQRcodeWrapper, SelfAppBuilder } from "@selfxyz/qrcode";
import { v4 as uuidv4 } from "uuid";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const userId = uuidv4();

// Create a SelfApp instance using the builder pattern
const selfApp = new SelfAppBuilder({
  appName: "Creator Rewards",
  scope: "creator-rewards",
  endpoint: "https://cannes.creatorscore.app/api/self-verification",
  logoBase64: "<base64EncodedLogo>", // Optional, accepts also PNG url
  userId,
  disclosures: {
    // NEW: Specify verification requirements
    minimumAge: 18, // Must match backend config
    excludedCountries: ["IRN", "PRK"], // Must match backend config
    ofac: true, // Must match backend config
    nationality: true, // Request nationality disclosure
    name: true, // Request name disclosure
    date_of_birth: true // Request date of birth disclosure
  }
}).build();

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

        {/* <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold tracking-tight pb-5">Self Verification</h2>
          <SelfQRcodeWrapper
            selfApp={selfApp}
            onSuccess={() => {
              console.log("Verification successful");
              // Perform actions after successful verification
            }}
            onError={error => {
              console.error("Verification failed:", error);
            }}
          />
        </div>
        */}
      </div>
    </div>
  );
}
