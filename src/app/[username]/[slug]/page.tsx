"use client";

import { useParams, useRouter } from "next/navigation";
import { usePostBySlug, useDeletePost } from "@/hooks/usePosts";
import { useCurrentUser } from "@/hooks/useUsers";
import MarkdownPreview from "@/components/write/MarkdownPreview";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { getPostThumbnailUrl } from "@/lib/utils";
import Image from "next/image";

export default function UserPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params.slug as string;

  const slug = decodeURIComponent(rawSlug);
  console.log("🔍 원본:", rawSlug);
  console.log("🔍 디코딩:", slug);

  const { data: user } = useCurrentUser();
  const deletePostMutation = useDeletePost();

  // 삭제 중이거나 성공한 경우에는 쿼리 비활성화
  const shouldEnableQuery =
    !deletePostMutation.isPending && !deletePostMutation.isSuccess;
  const {
    data: post,
    isLoading,
    error,
  } = usePostBySlug(slug, shouldEnableQuery);

  console.log(post);

  // 삭제 성공 시 리다이렉트
  useEffect(() => {
    if (deletePostMutation.isSuccess && user?.idname) {
      router.replace(`/@${user.idname}/posts`);
    }
  }, [deletePostMutation.isSuccess, user?.idname, router]);

  // 삭제 중이거나 성공 시에는 로딩 화면 표시
  if (deletePostMutation.isPending) {
    return <div className="p-8">삭제 중...</div>;
  }

  if (deletePostMutation.isSuccess) {
    return <div className="p-8">삭제 완료. 이동 중...</div>;
  }

  // 현재 사용자가 포스트 작성자인지 확인
  const isAuthor = user && post && user.id === post.author.id;

  const handleEdit = () => {
    router.push(`/write?slug=${slug}`);
  };

  const handleDelete = async () => {
    if (!post) return;

    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(post.id);
      // 리다이렉트는 useEffect에서 처리됨
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return <div className="p-8">로딩 중...</div>;
  }

  if (error || !post || !post.author) {
    return <div className="p-8">게시글을 찾을 수 없습니다.</div>;
  }

  const thumbnailUrl = getPostThumbnailUrl(post.thumbnail);

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

          {/* 작성자인 경우 수정/삭제 버튼, 아닌 경우 팔로우 버튼 */}
          {isAuthor ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                수정
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deletePostMutation.isPending}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                {deletePostMutation.isPending ? "삭제 중..." : "삭제"}
              </Button>
            </div>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700">팔로우</Button>
          )}
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
        {/* 썸네일 이미지 추가 */}
        {thumbnailUrl && (
          <div className="mb-15 mt-15 ">
            <Image
              src={thumbnailUrl}
              alt={post.title}
              width={800}
              height={600}
              className="max-w-full max-h-screen h-auto w-auto rounded-lg mx-auto block"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={true}
            />
          </div>
        )}
      </header>

      <div className="prose max-w-none">
        <MarkdownPreview content={post.content} />
      </div>
    </div>
  );
}
