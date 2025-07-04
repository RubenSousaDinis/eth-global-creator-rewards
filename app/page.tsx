"use client";

import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Our Header Component */}
      <Header onInfoClick={() => console.log("Info clicked")} />

      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">Creator Score</h1>
            <p className="text-xl text-muted-foreground">
              Track and showcase your builder achievements
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                • Click the info button (❓) in the header to test functionality
              </p>
              <p>• Navigation is now powered by useUserNavigation hook</p>
              <p>• Profile link is dynamic based on user authentication</p>
              <p>
                • Bottom navigation appears on mobile (resize browser to test)
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Our BottomNav Component */}
      <BottomNav />
    </div>
  );
}
