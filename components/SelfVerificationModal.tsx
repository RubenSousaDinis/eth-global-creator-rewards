"use client";

import { v4 as uuidv4 } from "uuid";
import { countries } from "@selfxyz/core";
import { SelfQRcodeWrapper, SelfAppBuilder, type SelfApp } from "@selfxyz/qrcode";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";

interface SelfVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SelfVerificationModal({ open, onOpenChange }: SelfVerificationModalProps) {
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
  const excludedCountries = useMemo(() => [countries.NORTH_KOREA, countries.IRAN], []);
  const userId = useMemo(() => uuidv4(), []);

  useEffect(() => {
    if (open) {
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
        setVerificationStatus("pending");
      } catch (error) {
        console.error("Failed to initialize Self app:", error);
        setVerificationStatus("error");
      }
    }
  }, [open, userId, excludedCountries]);

  const handleSuccess = () => {
    console.log("Verification successful");
    setVerificationStatus("success");
    // Auto-close modal after 2 seconds on success
    setTimeout(() => {
      onOpenChange(false);
    }, 2000);
  };

  const handleError = () => {
    console.error("Error: Failed to verify identity");
    setVerificationStatus("error");
  };

  const renderContent = () => {
    if (verificationStatus === "success") {
      return (
        <div className="flex flex-col items-center space-y-4 py-8">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h3 className="text-xl font-semibold text-green-700">Verification Successful!</h3>
          <p className="text-sm text-muted-foreground text-center">
            Your identity has been verified successfully. This modal will close automatically.
          </p>
        </div>
      );
    }

    if (verificationStatus === "error") {
      return (
        <div className="flex flex-col items-center space-y-4 py-8">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <h3 className="text-xl font-semibold text-red-700">Verification Failed</h3>
          <p className="text-sm text-muted-foreground text-center">
            There was an error during verification. Please try again.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium">Scan QR Code with Self App</span>
        </div>

        {selfApp ? (
          <SelfQRcodeWrapper selfApp={selfApp} onSuccess={handleSuccess} onError={handleError} />
        ) : (
          <div className="w-[256px] h-[256px] bg-gray-200 animate-pulse flex items-center justify-center rounded-lg">
            <p className="text-gray-500 text-sm">Loading QR Code...</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center space-y-1 max-w-sm">
          <p>• Download the Self app from your app store</p>
          <p>• Scan the QR code with your phone</p>
          <p>• Follow the instructions to verify your identity</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Identity Verification
          </DialogTitle>
          <DialogDescription>Verify your identity using Self to access Creator Rewards features.</DialogDescription>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
