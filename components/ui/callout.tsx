import * as React from "react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "warning";
  className?: string;
}

export function Callout({ children, variant = "default", className }: CalloutProps) {
  return (
    <div
      className={cn(
        "rounded-xl px-6 py-4 my-1 flex items-center text-xs",
        {
          "border border-border bg-muted text-foreground": variant === "default",
          "border border-destructive/20 bg-destructive/10 text-destructive": variant === "destructive",
          "border border-yellow-200 bg-yellow-50 text-yellow-800": variant === "warning"
        },
        className
      )}
    >
      {children}
    </div>
  );
}
