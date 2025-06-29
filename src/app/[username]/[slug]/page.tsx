"use client";

import { useParams } from "next/navigation";
import { usePostBySlug } from "@/hooks/usePosts";
import MarkdownPreview from "@/components/write/MarkdownPreview";

export default function UserPostDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = usePostBySlug(slug);
  console.log(post);

  if (isLoading) {
    return <div className="p-8">로딩 중...</div>;
  }

  if (error || !post || !post.author) {
    return <div className="p-8">게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-5xl font-bold mb-6 leading-relaxed">
          {post.title}
        </h1>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-lg text-gray-800">
            <span className="font-medium">{post.author.displayName}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-600 text-base">
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                "ko-KR",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            팔로우
          </button>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose max-w-none">
        <MarkdownPreview content={post.content} />
      </div>
    </div>
  );
}
