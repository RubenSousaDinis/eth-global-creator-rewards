"use client";

import { useState } from "react";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { Home, Trophy, User, Settings } from "lucide-react";

// Mock navigation data
const mockNavItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    disabled: true,
  },
];

export default function App() {
  const [showNav, setShowNav] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Our Header Component */}
      <Header
        navItems={showNav ? mockNavItems : []}
        onInfoClick={() => console.log("Info clicked")}
      />

      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">Creator Score</h1>
            <p className="text-xl text-muted-foreground">
              Track and showcase your builder achievements
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowNav(!showNav)} variant="outline">
                {showNav ? "Hide Navigation" : "Show Navigation"}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                • Click the info button (❓) in the header to test functionality
              </p>
              <p>
                • Toggle navigation to see different header/bottom nav states
              </p>
              <p>• Check browser console for click events</p>
              <p>
                • Bottom navigation appears on mobile (resize browser to test)
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Our BottomNav Component */}
      <BottomNav navItems={showNav ? mockNavItems : []} />
    </div>
  );
}
