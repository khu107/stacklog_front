// app/[username]/page.tsx (벨로그 스타일)
"use client";

import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
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

const mockTags = [{ name: "전체보기", count: 0 }];

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState("posts");

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
            <button
              onClick={() => setActiveTab("posts")}
              className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "posts"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              글
            </button>
            <button
              onClick={() => setActiveTab("series")}
              className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "series"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              시리즈
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "about"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              소개
            </button>
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
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <span className="text-green-600 text-sm font-medium">
                      {tag.name}
                    </span>
                    <span className="text-gray-500 text-xs">({tag.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="col-span-9">
            {activeTab === "posts" && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  아직 작성한 포스트가 없습니다.
                </h3>
                <p className="text-gray-600">첫 번째 포스트를 작성해보세요!</p>
              </div>
            )}

            {activeTab === "series" && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  아직 작성한 시리즈가 없습니다.
                </h3>
                <p className="text-gray-600">
                  연관된 포스트들을 시리즈로 묶어보세요.
                </p>
              </div>
            )}

            {activeTab === "about" && (
              <div className="py-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    소개
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {mockUser.bio}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
