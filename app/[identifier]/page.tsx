import { Header } from "@/components/navigation/Header";
import { DeployedPosts } from "@/components/DeployedPosts";

interface ProfilePageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { identifier } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
            <p className="text-xl text-muted-foreground">@{identifier}</p>
            <div className="text-sm text-muted-foreground">
              <p>Identifier: {identifier}</p>
            </div>
          </div>

          <div className="mt-8">
            <DeployedPosts walletAddress={identifier} />
          </div>
        </div>
      </main>
    </div>
  );
}
