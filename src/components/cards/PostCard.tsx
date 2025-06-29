import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Calendar, MessageCircle, Eye, FileImage } from "lucide-react";
import { useState } from "react";

import { Post } from "@/lib/api/posts";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";

// API Post 타입을 직접 사용
interface PostCardProps {
  post: Post;
  onClick?: () => void;
  // 임시로 좋아요, 댓글, 조회수는 props로 받거나 기본값 사용
  likes?: number;
  comments?: number;
  views?: number;
}

// 안전한 이미지 컴포넌트
const SafePostImage = ({
  thumbnail,
  title,
  onClick,
}: {
  thumbnail: string | null | undefined;
  title: string;
  onClick?: () => void;
}) => {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getImageUrl(thumbnail);

  // 이미지가 없거나 에러가 발생한 경우 플레이스홀더 표시
  if (!imageUrl || hasError) {
    return (
      <div
        className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center cursor-pointer hover:from-gray-100 hover:to-gray-150 transition-colors"
        onClick={onClick}
      >
        <div className="text-center text-gray-400">
          <FileImage className="w-12 h-12 mx-auto mb-2" />
          <p className="text-xs font-medium">No Image</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={title}
      width={400}
      height={200}
      className="w-full h-full object-cover hover:scale-105 transition-transform"
      onError={() => setHasError(true)}
    />
  );
};

export function PostCard({
  post,
  onClick,
  likes = 0,
  comments = 0,
  views = 0,
}: PostCardProps) {
  // 텍스트를 3줄로 자르고 말줄임표 추가하는 함수
  const truncateText = (text: string, maxLines: number = 3) => {
    // 마크다운 문법 제거 (간단한 처리)
    const cleanText = text
      .replace(/#{1,6}\s+/g, "") // # 제거
      .replace(/\*\*(.*?)\*\*/g, "$1") // **bold** 제거
      .replace(/\*(.*?)\*/g, "$1") // *italic* 제거
      .replace(/```[\s\S]*?```/g, "") // 코드블록 제거
      .replace(/`(.*?)`/g, "$1") // 인라인 코드 제거
      .replace(/\n\s*\n/g, " ") // 여러 줄바꿈을 공백으로
      .replace(/\n/g, " ") // 줄바꿈을 공백으로
      .trim();

    // 한글과 영문을 고려한 더 정확한 계산
    const avgCharsPerLine = 28; // 카드 너비에 맞춰 조정
    const maxChars = avgCharsPerLine * maxLines;

    if (cleanText.length <= maxChars) {
      return cleanText;
    }

    return cleanText.substring(0, maxChars - 3) + "...";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0">
      <div className="w-full h-64 relative cursor-pointer overflow-hidden">
        <SafePostImage
          thumbnail={post.thumbnail}
          title={post.title}
          onClick={onClick}
        />
      </div>

      <CardHeader className="px-6">
        <h3
          className="font-semibold text-lg leading-tight hover:text-primary cursor-pointer truncate"
          onClick={onClick}
          title={post.title}
        >
          {post.title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0 px-6 pb-6">
        <div
          className="text-muted-foreground text-sm mb-4 h-[4.5rem] cursor-pointer leading-relaxed overflow-hidden"
          onClick={onClick}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {truncateText(post.content)}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={getImageUrl(post.author.avatarUrl || null) || undefined}
                alt={post.author.displayName}
              />
              <AvatarFallback className="text-xs">
                {post.author.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{post.author.displayName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
              "ko-KR"
            )}
          </div>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{views}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
