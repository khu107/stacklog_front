import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Eye } from "lucide-react";
import { Post } from "@/lib/api/posts";

interface SearchResultCardProps {
  post: Post;
}

export default function SearchResultCard({ post }: SearchResultCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // 이미지 URL 생성 함수 - 로컬과 외부 URL 구분
  const getImageUrl = (imagePath: string, isLocal: boolean = false) => {
    if (!imagePath) return null;

    // 이미 전체 URL인 경우 (Google, GitHub 등)
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // 로컬 이미지인 경우에만 NestJS 서버 URL 추가
    if (isLocal) {
      const apiBaseUrl = "http://localhost:3000";
      const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
      return `${apiBaseUrl}${path}`;
    }

    return imagePath;
  };

  const imageUrl = post.thumbnail ? getImageUrl(post.thumbnail, true) : null;
  const avatarUrl = post.author.avatarUrl
    ? getImageUrl(
        post.author.avatarUrl,
        !post.author.avatarUrl.startsWith("http")
      )
    : undefined;

  // 포스트 링크로 이동하는 함수
  const handlePostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `/@${post.author.idname}/${post.slug}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-sm">
      {/* Author Header */}
      <div className="flex items-center gap-3 p-4 bg-white">
        <Avatar className="w-10 h-10">
          {avatarUrl && <AvatarImage src={avatarUrl} />}
          <AvatarFallback className="bg-gray-200 text-gray-600">
            {getInitials(post.author.displayName || post.author.idname)}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-gray-900">
          {post.author.displayName || post.author.idname}
        </span>
      </div>

      {/* Thumbnail Image - 일반 img 태그 사용 */}
      {imageUrl && (
        <div className="w-full h-64 overflow-hidden bg-gray-100">
          {/* 디버깅을 위한 URL 표시 */}
          <div className="text-xs text-gray-500 p-2">Image URL: {imageUrl}</div>
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              console.error("Original thumbnail path:", post.thumbnail);
              // 부모 div 숨기기
              const parentDiv = e.currentTarget.parentElement;
              if (parentDiv) {
                parentDiv.style.display = "none";
              }
            }}
            onLoad={() => {
              console.log("Image loaded successfully:", imageUrl);
            }}
          />
        </div>
      )}

      {/* Content */}
      <CardContent className="p-6 space-y-4">
        {/* Title - 클릭 가능 */}
        <h2
          className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handlePostClick}
        >
          {post.title}
        </h2>

        {/* Summary */}
        {post.summary && (
          <p className="text-gray-600 leading-relaxed line-clamp-3">
            {post.summary}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 5).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-teal-100 text-teal-700 hover:bg-teal-200 text-xs px-2 py-1"
              >
                {tag}
              </Badge>
            ))}
            {post.tags.length > 5 && (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1"
              >
                +{post.tags.length - 5}개 더
              </Badge>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>19개의 댓글</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
