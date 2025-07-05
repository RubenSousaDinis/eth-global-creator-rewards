import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { resolveTalentUser } from "@/lib/user-resolver";
import { RESERVED_WORDS } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function PublicProfilePage({ params }: { params: Promise<{ identifier: string }> }) {
  // Await params in Next.js 15
  const { identifier } = await params;

  if (RESERVED_WORDS.includes(identifier)) {
    return null;
  }

  // Try to resolve user with existing Talent API logic
  const userPromise = resolveTalentUser(identifier);
  const user = await userPromise;
  if (!user || !user.id) {
    return <div className="p-8 text-center text-destructive">User not found</div>;
  }
  // Determine canonical human-readable identifier: Farcaster, then Github, else UUID
  const canonical = user.fname || user.github || user.id;
  if (canonical && identifier !== canonical && identifier !== undefined) {
    redirect(`/${canonical}`);
  }
  return <ProfileScreen talentUUID={user.id} />;
}
