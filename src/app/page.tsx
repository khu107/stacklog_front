// src/app/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Eye } from "lucide-react";
import Link from "next/link";

// JWT 토큰에서 사용자 정보 추출 함수 (기존 사용자 로그인용)
const extractUserFromToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub,
      email: payload.email,
      profileName: payload.profileName,
      userId: payload.userId,
      introduction: payload.introduction || "",
      isVerified: true,
    };
  } catch (error) {
    console.error("토큰 디코딩 실패:", error);
    return null;
  }
};

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

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, user, isAuthenticated, getAccessToken } = useAuthStore();
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // 🔑 기존 사용자 로그인 처리 (URL에서 accessToken 읽기)
  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (accessToken) {
      console.log("🔑 기존 사용자 로그인 처리 중...");
      console.log("Access Token:", accessToken.substring(0, 50) + "...");

      // JWT에서 사용자 정보 추출
      const userData = extractUserFromToken(accessToken);

      if (userData) {
        // Zustand 스토어에 로그인 정보 저장
        login(userData, accessToken);

        console.log("✅ 기존 사용자 자동 로그인 완료:", userData.email);
        console.log("🍪 Refresh Token은 쿠키로 자동 관리됨");

        // URL에서 토큰 제거 (깔끔하게)
        router.replace("/");
      } else {
        console.error("❌ 토큰에서 사용자 정보 추출 실패");
        router.replace("/login?error=invalid_token");
      }
    }
  }, [searchParams, router, login]);

  // 💝 좋아요 버튼 클릭 핸들러
  const handleLike = async (postId: number) => {
    // 🔐 인증 체크
    if (!isAuthenticated()) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      const token = getAccessToken();

      // API 호출 (실제로는 백엔드 API 호출)
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        // 좋아요 성공
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(postId)) {
            newSet.delete(postId); // 좋아요 취소
          } else {
            newSet.add(postId); // 좋아요 추가
          }
          return newSet;
        });
        console.log(
          `✅ 게시글 ${postId} 좋아요 ${
            likedPosts.has(postId) ? "취소" : "추가"
          }`
        );
      } else if (response.status === 401) {
        // 토큰 만료 - 실제로는 토큰 갱신 로직이 들어가야 함
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
    }
  };

  const getUserInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const isLoggedIn = isAuthenticated() && user;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* 헤더 섹션 - 로그인 상태에 따라 다른 메시지 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {isLoggedIn
              ? `안녕하세요, ${user.profileName}님!`
              : "개발자들의 이야기"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {isLoggedIn
              ? "오늘은 어떤 개발 경험을 나누시겠어요?"
              : "다양한 개발 경험과 지식을 공유하는 공간입니다"}
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

                {/* 상호작용 버튼들 */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {/* 좋아요 버튼 - 인증 필요 */}
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                      likedPosts.has(post.id) ? "text-red-500" : ""
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedPosts.has(post.id) ? "fill-current" : ""
                      }`}
                    />
                    <span>
                      {post.stats.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </span>
                  </button>

                  {/* 댓글 버튼 - 인증 필요 */}
                  <button
                    onClick={() => {
                      if (!isAuthenticated()) {
                        setShowLoginPrompt(true);
                        return;
                      }
                      // 댓글 로직
                    }}
                    className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.stats.comments}</span>
                  </button>

                  {/* 조회수 - 인증 불필요 */}
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

      {/* 🔐 로그인 안내 모달 */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <h2 className="text-xl font-bold">로그인이 필요합니다</h2>
              <p className="text-muted-foreground">
                좋아요와 댓글을 남기려면 로그인해주세요
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/login" className="w-full">
                <Button className="w-full">로그인하기</Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowLoginPrompt(false)}
              >
                취소
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
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
