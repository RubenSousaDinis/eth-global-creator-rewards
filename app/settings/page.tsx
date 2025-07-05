import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header onInfoClick={() => console.log("Info clicked")} />

      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
            <p className="text-xl text-muted-foreground">
              Configure your Creator Score preferences
            </p>
            <div className="text-sm text-muted-foreground">
              <p>🚧 Coming soon: Settings configuration options</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
