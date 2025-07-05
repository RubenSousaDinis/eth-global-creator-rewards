"use client";

import React, { useState } from "react";
import { useOriginUrlData } from "@/hooks/useOriginUrl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Copy, Calendar, Hash, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeedPost } from "@/hooks/useFeed";

interface PostCardProps {
  post: FeedPost;
}

export function PostCard({ post }: PostCardProps) {
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  // Use the origin URL hook
  const { originUrl } = useOriginUrlData(isLoadingUrl ? post.clone : "", post.type, isLoadingUrl);

  // Handle clicking to get the post URL
  const handleGetPostUrl = async () => {
    setIsLoadingUrl(true);
  };

  // Open URL when it's fetched
  React.useEffect(() => {
    if (originUrl && isLoadingUrl) {
      window.open(originUrl, "_blank");
      setIsLoadingUrl(false);
    }
  }, [originUrl, isLoadingUrl]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow duration-200", "bg-card border border-border/50", "group")}>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {post.type === "mirror" ? (
              <Copy className="w-4 h-4 text-purple-500 flex-shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )}
            <h3 className="font-medium text-sm truncate flex-1">{post.name}</h3>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                post.type === "mirror"
                  ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700"
                  : "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700"
              )}
            >
              {post.type === "mirror" ? "Mirror" : "Paragraph"}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {formatAddress(post.owner)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(parseInt(post.blockTimestamp) * 1000).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Hash className="w-3 h-3" />
              {formatAddress(post.clone)}
            </span>
            <button
              onClick={handleGetPostUrl}
              disabled={isLoadingUrl}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ml-auto",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              )}
            >
              {isLoadingUrl ? (
                <>
                  <div className="w-3 h-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Loading...
                </>
              ) : (
                <>
                  <ExternalLink className="w-3 h-3" />
                  Open
                </>
              )}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
