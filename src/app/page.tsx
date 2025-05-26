// src/app/page.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Eye } from "lucide-react";

// 임시 데이터 (나중에 API로 대체)
const mockPosts = [
  {
    id: 1,
    title: "Next.js 15로 블로그 만들기",
    summary:
      "Next.js 15의 새로운 기능들을 활용해서 개인 블로그를 만드는 과정을 정리했습니다. App Router와 Server Components를 중심으로...",
    thumbnail:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop",
    author: {
      name: "김개발",
      userId: "kim_dev",
      avatar: "",
    },
    createdAt: "2025년 5월 27일",
    stats: {
      likes: 24,
      comments: 5,
      views: 142,
    },
  },
  {
    id: 2,
    title: "TypeScript 고급 패턴 정리",
    summary:
      "실제 프로젝트에서 사용하고 있는 TypeScript 고급 패턴들을 정리해보았습니다. Generic, Conditional Types, Mapped Types...",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop",
    author: {
      name: "박타입",
      userId: "park_type",
      avatar: "",
    },
    createdAt: "2025년 5월 26일",
    stats: {
      likes: 18,
      comments: 3,
      views: 89,
    },
  },
  {
    id: 3,
    title: "React Query vs SWR 비교 분석",
    summary:
      "두 라이브러리의 장단점을 실제 사용 경험을 바탕으로 비교 분석해보았습니다. 성능, 번들 크기, 개발자 경험 등을...",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop",
    author: {
      name: "이쿼리",
      userId: "lee_query",
      avatar: "",
    },
    createdAt: "2025년 5월 25일",
    stats: {
      likes: 31,
      comments: 8,
      views: 203,
    },
  },
  {
    id: 4,
    title: "CSS Grid와 Flexbox 실전 활용법",
    summary:
      "레이아웃 구성 시 CSS Grid와 Flexbox를 언제, 어떻게 사용해야 하는지에 대한 실전 경험을 공유합니다...",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
    author: {
      name: "최스타일",
      userId: "choi_style",
      avatar: "",
    },
    createdAt: "2025년 5월 24일",
    stats: {
      likes: 15,
      comments: 2,
      views: 67,
    },
  },
];

export default function HomePage() {
  const getUserInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* 헤더 섹션 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">개발자들의 이야기</h1>
          <p className="text-xl text-muted-foreground">
            다양한 개발 경험과 지식을 공유하는 공간입니다
          </p>
        </div>

        {/* 글 목록 */}
        <div className="grid gap-6 md:grid-cols-2">
          {mockPosts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* 썸네일 */}
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>

              <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold line-clamp-2 hover:text-primary">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {post.summary}
                </p>
              </CardHeader>

              <CardContent>
                {/* 작성자 정보 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={post.author.avatar}
                        alt={post.author.name}
                      />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(post.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{post.author.userId}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {post.createdAt}
                  </span>
                </div>

                {/* 통계 정보 */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.stats.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.stats.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.stats.views}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <div className="text-center mt-8">
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            더 많은 글 보기
          </button>
        </div>
      </div>
    </div>
  );
}
