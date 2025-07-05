"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SelfVerificationModal } from "@/components/SelfVerificationModal";
import { Shield, Settings, Users } from "lucide-react";

export default function SettingsPage() {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const router = useRouter();
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-xl text-muted-foreground">Configure your Creator Score preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Identity Verification Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Self Verification
              </CardTitle>
              <CardDescription>
                <strong>Verification is required to receive Rewards.</strong> Verify your identity using Self to prove
                you&apos;re a real person and unlock the weekly rewards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">What you&apos;ll get after verification:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Access to Creator Rewards airdrops</li>
                    <li>• Verified creator badge</li>
                    <li>• Enhanced security and trust in the platform</li>
                  </ul>
                  <p className="text-sm text-orange-600 mt-3 font-medium">
                    ⚠️ You must complete verification to use receive rewards.
                  </p>
                </div>
                <Button onClick={() => setShowVerificationModal(true)} className="w-full sm:w-auto">
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Identity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                More Settings
              </CardTitle>
              <CardDescription>Additional configuration options coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  🚧 More settings and configuration options will be available soon
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SelfVerificationModal open={showVerificationModal} onOpenChange={setShowVerificationModal} />
    </div>
  );
}
