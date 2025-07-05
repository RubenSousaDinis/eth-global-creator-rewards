"use client";

// import { SelfAppBuilder } from "@selfxyz/qrcode";
// import SelfQRcodeWrapper from "@selfxyz/qrcode";
// import { v4 as uuidv4 } from "uuid";

// const userId = uuidv4();

// Create a SelfApp instance using the builder pattern
// const selfApp = new SelfAppBuilder({
//   appName: "Creator Rewards",
//   scope: "creator-rewards",
//   endpoint: "https://cannes.creatorscore.app/api/self-verification",
//   logoBase64: "<base64EncodedLogo>", // Optional, accepts also PNG url
//   userId,
//   disclosures: {
//     // NEW: Specify verification requirements
//     minimumAge: 18, // Must match backend config
//     excludedCountries: ["IRN", "PRK"], // Must match backend config
//     ofac: true, // Must match backend config
//     nationality: true, // Request nationality disclosure
//     name: true, // Request name disclosure
//     date_of_birth: true // Request date of birth disclosure
//   }
// }).build();

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-xl text-muted-foreground">
          Configure your Creator Score preferences
        </p>
        <div className="text-sm text-muted-foreground">
          <p>🚧 Coming soon: Settings configuration options</p>
        </div>
        {/* <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold tracking-tight pb-5">Self Verification</h2>
          <SelfQRcodeWrapper
            selfApp={selfApp}
            onSuccess={() => {
              console.log("Verification successful");
              // Perform actions after successful verification
            }}
          />
        </div> */}
      </div>
    </div>
  );
}
