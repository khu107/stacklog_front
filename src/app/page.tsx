"use client";

import { Suspense } from "react";
import { PostCard } from "@/components/cards/PostCard";
import { usePublicPosts } from "@/hooks/usePosts";

function HomeContent() {
  const { data: posts, isLoading, error } = usePublicPosts();
  console.log(posts);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">게시글을 불러오는데 실패했습니다.</p>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-8">블로그 포스트</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">아직 게시글이 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8">블로그 포스트</h1>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => {
                window.location.href = `/${post.author.idname}/${post.slug}`;
              }}
              // 임시 랜덤 값들 (나중에 실제 데이터로 교체)
              likes={Math.floor(Math.random() * 100)}
              comments={Math.floor(Math.random() * 20)}
              views={Math.floor(Math.random() * 1000)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
