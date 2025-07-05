"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserNavigation } from "@/hooks/useUserNavigation";

interface HeaderProps {
  onInfoClick?: () => void;
}

export function Header({ onInfoClick }: HeaderProps) {
  const pathname = usePathname();
  const { navItems } = useUserNavigation();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white">
      <div className="flex h-14 w-full items-center justify-between px-4 md:px-8 relative">
        <h1 className="text-lg font-semibold">Creator Score</h1>

        {/* Desktop nav icons, centered */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
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
                  className={
                    "flex items-center justify-center h-10 w-12 rounded-full transition-colors " +
                    (isActive
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:bg-muted/50")
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

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Learn more about Creator Score"
          onClick={onInfoClick}
        >
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
}
