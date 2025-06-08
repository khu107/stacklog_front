// app/[username]/posts/page.tsx (벨로그 스타일)
"use client";

import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// 임시 데이터
const mockUser = {
  username: "dev",
  displayName: "Khusan",
  bio: "풀스택 개발자입니다.",
  avatarUrl: "https://github.com/shadcn.png",
  followersCount: 0,
  followingCount: 0,
};

const mockPosts = [
  {
    id: 1,
    title: "React 18의 새로운 기능들",
    summary:
      "React 18에서 새롭게 도입된 Concurrent Features와 Suspense에 대해 알아보겠습니다.",
    thumbnail:
      "https://via.placeholder.com/320x160/3b82f6/ffffff?text=React+18",
    publishedAt: "6일 전",
    likesCount: 24,
    commentsCount: 5,
    tags: ["React", "JavaScript"],
  },
  {
    id: 2,
    title: "Next.js App Router 완벽 가이드",
    summary: "Next.js 13부터 도입된 App Router의 모든 것을 정리해보았습니다.",
    thumbnail: "https://via.placeholder.com/320x160/000000/ffffff?text=Next.js",
    publishedAt: "1주 전",
    likesCount: 18,
    commentsCount: 3,
    tags: ["Next.js", "React"],
  },
  {
    id: 3,
    title: "TypeScript 5.0 새로운 기능",
    summary: "TypeScript 5.0에서 추가된 새로운 기능들을 살펴보겠습니다.",
    publishedAt: "2주 전",
    likesCount: 31,
    commentsCount: 8,
    tags: ["TypeScript"],
  },
];

const mockTags = [
  { name: "전체보기", count: mockPosts.length },
  { name: "React", count: 2 },
  { name: "Next.js", count: 1 },
  { name: "TypeScript", count: 1 },
  { name: "JavaScript", count: 1 },
];

export default function PostsPage() {
  const params = useParams();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("전체보기");

  // 필터링된 게시글
  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag =
      selectedTag === "전체보기" || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 프로필 헤더 - 중앙 정렬 */}
        <div className="text-center mb-12">
          <Avatar className="w-32 h-32 mx-auto mb-6">
            <AvatarImage src={mockUser.avatarUrl} alt={mockUser.displayName} />
            <AvatarFallback className="text-2xl bg-gray-100">
              {mockUser.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {mockUser.displayName}
          </h1>

          <p className="text-gray-600 mb-6 max-w-md mx-auto">{mockUser.bio}</p>

          {/* 팔로워/팔로잉 */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {mockUser.followersCount}
              </div>
              <div className="text-sm text-gray-600">팔로워</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {mockUser.followingCount}
              </div>
              <div className="text-sm text-gray-600">팔로잉</div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-8">
            <Link
              href={`/@${username}`}
              className="pb-3 px-2 border-b-2 border-green-500 text-green-600 font-medium"
            >
              글
            </Link>
            <Link
              href={`/@${username}/series`}
              className="pb-3 px-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium"
            >
              시리즈
            </Link>
            <Link
              href={`/@${username}/about`}
              className="pb-3 px-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium"
            >
              소개
            </Link>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="grid grid-cols-12 gap-8">
          {/* 왼쪽 사이드바 */}
          <div className="col-span-3">
            {/* 검색 */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* 태그 목록 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">태그 목록</h3>
              <div className="space-y-2">
                {mockTags.map((tag) => (
                  <div
                    key={tag.name}
                    onClick={() => setSelectedTag(tag.name)}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTag === tag.name
                        ? "bg-green-50 text-green-600"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="text-sm font-medium">{tag.name}</span>
                    <span className="text-gray-500 text-xs">({tag.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="col-span-9">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  게시글이 없습니다
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "검색 결과가 없습니다"
                    : "첫 번째 포스트를 작성해보세요!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-sm overflow-hidden"
                  >
                    <CardContent className="p-0">
                      {post.thumbnail && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.summary}
                        </p>

                        {/* 태그 */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* 하단 정보 */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{post.publishedAt}</span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{post.likesCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>{post.commentsCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
