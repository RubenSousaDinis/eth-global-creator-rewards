// Shared user/account resolver logic for Talent Protocol users
import { getLocalBaseUrl } from "./constants";

export function getAccountSource(id: string): "wallet" | "farcaster" | null {
  if (id.startsWith("0x") && id.length === 42) return "wallet";
  if (/^\d+$/.test(id)) return "farcaster";
  // Farcaster usernames: 1-16 chars, lowercase, alphanumeric, may include . or -
  if (/^[a-z0-9][a-z0-9\-\.]{0,15}$/.test(id)) return "farcaster";
  // UUID or unknown: return null to omit account_source
  return null;
}

/**
 * Resolves a Talent Protocol user identifier (Farcaster username, Github username, or UUID) to a user object.
 * Always calls /api/talent-user?id=identifier and lets the API route determine account_source.
 * Returns { id, fid, fname, github, ... } or null if not found.
 */
export async function resolveTalentUser(identifier: string): Promise<{
  id: string | null;
  fid: number | null;
  wallet: string | null;
  github: string | null;
  fname: string | null;
  display_name: string | null;
  image_url: string | null;
  [key: string]: unknown;
} | null> {
  let baseUrl = "";
  if (typeof window === "undefined") {
    baseUrl = process.env.NEXT_PUBLIC_URL || getLocalBaseUrl();
  }

  // Add retry logic for server-side calls
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`${baseUrl}/api/talent-user?id=${identifier}`);

      if (res.ok) {
        const user = await res.json();
        // Accept if any identifier is present
        if (user && (user.fid || user.wallet || user.github || user.id)) {
          return {
            id: user.id || null,
            fid: user.fid ?? null,
            wallet: user.wallet ?? null,
            github: user.github ?? null,
            fname: user.fname ?? null,
            display_name: user.display_name ?? null,
            image_url: user.image_url ?? null,
            ...user
          };
        }
      }

      // If we get here, the response was not ok or user data was invalid
      lastError = new Error(`HTTP ${res.status}: ${res.statusText}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[resolveTalentUser] Attempt ${attempt}/${maxRetries} failed:`, lastError.message);

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, attempt * 100));
      }
    }
  }

  console.error(`[resolveTalentUser] All attempts failed for identifier "${identifier}":`, lastError?.message);
  return null;
}
