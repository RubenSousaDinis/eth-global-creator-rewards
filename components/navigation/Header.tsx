"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserNavigation } from "@/hooks/useUserNavigation";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

interface HeaderProps {
  onInfoClick?: () => void;
}

export function Header({ onInfoClick }: HeaderProps) {
  const pathname = usePathname();
  const { navItems, user } = useUserNavigation();
  const { primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext();

  // User is logged in if they have primaryWallet (connected) - no signing required
  const isLoggedIn = !!primaryWallet;

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    // If item requires auth and user is not logged in, prevent navigation and show auth modal
    if (item.requiresAuth && !isLoggedIn) {
      e.preventDefault();
      setShowAuthFlow(true);
      return;
    }
    // Otherwise, allow normal navigation
  };

  const handleAuthAction = async () => {
    if (isLoggedIn) {
      try {
        // For connect-only mode, we need to properly disconnect
        if (primaryWallet?.connector?.endSession) {
          await primaryWallet.connector.endSession();
        }
        // Then handle the logout from Dynamic
        await handleLogOut();
      } catch (error) {
        console.error("Error during logout:", error);
        // Force logout even if wallet disconnect fails
        try {
          await handleLogOut();
        } catch (logoutError) {
          console.error("Error during forced logout:", logoutError);
        }
      }
    } else {
      setShowAuthFlow(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white">
      <div className="flex h-14 w-full items-center justify-between px-4 md:px-8 relative">
        <h1 className="text-lg font-semibold">Creator Score</h1>

        {/* Desktop nav icons, centered */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            if (item.disabled) {
              return (
                <span
                  key={item.label}
                  className={
                    "flex items-center justify-center h-10 w-12 rounded-full text-muted-foreground opacity-50 cursor-not-allowed"
                  }
                  aria-label={item.label}
                >
                  <item.icon className="h-6 w-6" />
                </span>
              );
            }
            if (item.href) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={e => handleNavClick(e, item)}
                  className={
                    "flex items-center justify-center h-10 w-12 rounded-full transition-colors " +
                    (isActive ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted/50")
                  }
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="h-6 w-6" />
                </Link>
              );
            }
            return null;
          })}
        </nav>

        <Button onClick={handleAuthAction} variant={isLoggedIn ? "outline" : "default"} size="sm" className="h-9">
          {isLoggedIn ? "Log out" : "Log in"}
        </Button>
      </div>
    </header>
  );
}
