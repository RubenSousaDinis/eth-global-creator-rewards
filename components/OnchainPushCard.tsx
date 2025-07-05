"use client";

import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Database, ExternalLink, Loader2 } from "lucide-react";
import { useWalletCreatorScore } from "@/hooks/useWalletCreatorScore";
import { useENSName } from "@/hooks/useENSName";
import { setENSTextRecords } from "@/lib/ens-service";

interface OnchainPushCardProps {
  humanityVerified?: boolean;
}

export function OnchainPushCard({ humanityVerified = false }: OnchainPushCardProps) {
  const { primaryWallet } = useDynamicContext();
  const { creatorScore, loading: scoreLoading } = useWalletCreatorScore(primaryWallet?.address);

  console.log("primaryWallet", primaryWallet);
  const { ensName: resolvedEnsName, loading: ensLoading } = useENSName(primaryWallet?.address);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string>("");

  // Auto-populate ENS name when resolved
  useEffect(() => {
    if (resolvedEnsName && typeof resolvedEnsName === "string" && !ensName) {
      setEnsName(resolvedEnsName);
    }
  }, [resolvedEnsName, ensName]);

  const handlePushOnchain = async () => {
    if (!primaryWallet || !ensName || typeof ensName !== "string" || !ensName.trim()) return;

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const result = await setENSTextRecords({
        ensName: ensName.trim(),
        creatorScore: creatorScore || 0,
        humanityVerified,
        wallet: primaryWallet
      });

      if (result.success) {
        setTxHash(result.txHash || null);
      } else {
        setError(result.error || "Failed to push data onchain");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to push data onchain");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
          Push Onchain
        </CardTitle>
        <CardDescription>
          Push your Creator Score and humanity verification to your ENS name as text records
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Data Preview */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Data to Push:</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Creator Score</span>
              <div className="flex items-center gap-2">
                {scoreLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Badge variant="outline">{creatorScore || 0}</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Humanity Verified</span>
              <div className="flex items-center gap-2">
                {humanityVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                )}
                <Badge variant={humanityVerified ? "default" : "secondary"}>
                  {humanityVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* ENS Name Input */}
        <div className="space-y-3">
          <label htmlFor="ens-name" className="text-sm font-medium">
            ENS Name
          </label>
          <div className="relative">
            <input
              id="ens-name"
              type="text"
              placeholder="yourname.eth"
              value={ensName}
              onChange={e => setEnsName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            {ensLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {resolvedEnsName
              ? "ENS name automatically detected from your wallet. You can modify it if needed."
              : "Enter your ENS name to push your data as text records"}
          </p>
        </div>

        {/* Action Section */}
        <div className="space-y-4">
          <Button
            onClick={handlePushOnchain}
            disabled={isLoading || !ensName || typeof ensName !== "string" || !ensName.trim() || !primaryWallet}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Pushing Onchain...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Push to ENS
              </>
            )}
          </Button>

          {/* Success State */}
          {txHash && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Successfully pushed onchain!</p>
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:text-green-700 inline-flex items-center gap-1"
                >
                  View transaction <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="text-xs text-muted-foreground space-y-2">
          <p>
            <strong>What gets stored:</strong> Your creator score and humanity verification status will be stored as
            text records on your ENS name.
          </p>
          <p>
            <strong>Text Records:</strong> creator.score, humanity.verified, creator.updated
          </p>
          <p>
            <strong>Network:</strong> Ethereum Mainnet
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
