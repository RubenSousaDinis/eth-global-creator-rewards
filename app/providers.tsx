"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL
        }
      }}
    >
      <DynamicContextProvider
        settings={{
          environmentId:
            process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ||
            process.env.DYNAMIC_ENV_ID ||
            "x2762a57b-faa4-41ce-9f16-abff9300e2c9",
          walletConnectors: [EthereumWalletConnectors],
          // Connect-only mode for low-risk use case
          initialAuthenticationMode: "connect-only",
          // Disable visitor tracking for privacy
          enableVisitTrackingOnConnectOnly: false
        }}
      >
        {props.children}
      </DynamicContextProvider>
    </MiniKitProvider>
  );
}
