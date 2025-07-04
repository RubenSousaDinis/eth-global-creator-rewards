import { Header } from "./Header";
import { Home, Trophy, User, Settings } from "lucide-react";

// Mock navigation data for testing
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

export function HeaderDemo() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Header with Navigation</h3>
        <Header
          navItems={mockNavItems}
          onInfoClick={() => console.log("Info clicked")}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">
          Header without Navigation
        </h3>
        <Header navItems={[]} onInfoClick={() => console.log("Info clicked")} />
      </div>
    </div>
  );
}
