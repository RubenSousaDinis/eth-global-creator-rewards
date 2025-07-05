"use client";

import React, { useState } from "react";
import { useDeployedPostsData } from "@/hooks/useDeployedPosts";
import { useOriginUrlData } from "@/hooks/useOriginUrl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Copy, Calendar, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeployedPostsProps {
  talentIdentifier: string;
}

export function DeployedPosts({ talentIdentifier }: DeployedPostsProps) {
  console.log(talentIdentifier);
  const { posts, isLoading, error, paragraphCount, mirrorCount } = useDeployedPostsData(talentIdentifier);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPostType, setSelectedPostType] = useState<"paragraph" | "mirror">("paragraph");

  // Only fetch origin URL when a post is selected
  const { originUrl, isLoading: isLoadingUrl } = useOriginUrlData(
    selectedPostId || "",
    selectedPostType,
    !!selectedPostId
  );

  // Handle clicking to get the post URL
  const handleGetPostUrl = async (contractAddress: string, postType: "paragraph" | "mirror") => {
    setSelectedPostId(contractAddress);
    setSelectedPostType(postType);
  };

  // Open URL when it's fetched
  React.useEffect(() => {
    if (originUrl && selectedPostId) {
      window.open(originUrl, "_blank");
      setSelectedPostId(null); // Reset selection
    }
  }, [originUrl, selectedPostId]);

  if (isLoading) {
    return <div>Loading deployed posts...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error.message}</div>;
  }

  if (posts.length === 0) {
    return <div>No deployed posts found for this talent profile.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Deployed Posts ({posts.length})</h2>
        {(paragraphCount > 0 || mirrorCount > 0) && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            {paragraphCount > 0 && (
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Paragraph: {paragraphCount}
              </span>
            )}
            {mirrorCount > 0 && (
              <span className="flex items-center gap-1">
                <Copy className="w-3 h-3" />
                Mirror: {mirrorCount}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="space-y-3">
        {posts.map(post => (
          <Card
            key={post.id}
            className={cn("hover:shadow-md transition-shadow duration-200", "bg-card border border-border/50", "group")}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {post.type === "mirror" ? (
                      <Copy className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                    <h3 className="font-medium text-base truncate">{post.name}</h3>
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

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(parseInt(post.blockTimestamp) * 1000).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {post.clone.slice(0, 6)}...{post.clone.slice(-4)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleGetPostUrl(post.clone, post.type || "paragraph")}
                    disabled={isLoadingUrl && selectedPostId === post.clone}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed",
                      "group-hover:shadow-sm"
                    )}
                  >
                    {isLoadingUrl && selectedPostId === post.clone ? (
                      <>
                        <div className="w-3 h-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3 h-3" />
                        Open Post
                      </>
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
