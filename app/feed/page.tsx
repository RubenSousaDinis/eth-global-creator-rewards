"use client";

import { useFeed } from "@/hooks/useFeed";
import { PostCard } from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Rss, FileText, Copy, AlertCircle } from "lucide-react";

export default function FeedPage() {
  const { data, isLoading, error } = useFeed(20);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Rss className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Feed</h1>
            </div>
            <p className="text-xl text-muted-foreground">Latest posts from Mirror and Paragraph</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold">Paragraph Posts</h2>
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Copy className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold">Mirror Posts</h2>
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Rss className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Feed</h1>
            </div>
            <p className="text-xl text-muted-foreground">Latest posts from Mirror and Paragraph</p>
          </div>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Error loading feed</h2>
              </div>
              <p className="text-red-600 mt-2">{error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data || data.posts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Rss className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Feed</h1>
            </div>
            <p className="text-xl text-muted-foreground">Latest posts from Mirror and Paragraph</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No posts found in the feed.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Separate posts by type
  const paragraphPosts = data.posts.filter(post => post.type === "paragraph");
  const mirrorPosts = data.posts.filter(post => post.type === "mirror");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Rss className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Feed</h1>
          </div>
          <p className="text-xl text-muted-foreground">Latest posts from Mirror and Paragraph</p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-blue-500" />
              Paragraph: {data.paragraphCount}
            </span>
            <span className="flex items-center gap-1">
              <Copy className="w-4 h-4 text-purple-500" />
              Mirror: {data.mirrorCount}
            </span>
            <span>Total: {data.totalCount}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Paragraph Posts */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Paragraph Posts ({paragraphPosts.length})</h2>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {paragraphPosts.length > 0 ? (
                  paragraphPosts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No Paragraph posts found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mirror Posts */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Copy className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold">Mirror Posts ({mirrorPosts.length})</h2>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mirrorPosts.length > 0 ? (
                  mirrorPosts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No Mirror posts found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
