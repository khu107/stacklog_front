// src/components/layout/header.tsx (Hydration 이슈 해결)
"use client";

import { Button } from "@/components/ui/button";
import { Bell, PenSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import LoginModal from "../auth/login-register-modal";
import UserDropdown from "./user-dropdown";

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAuthenticated, hasHydrated } = useAuthStore();

  // 🔧 Hydration이 완료될 때까지 로그인 상태를 보여주지 않음
  const userLoggedIn = hasHydrated && isAuthenticated() && user;
  const showAuthUI = hasHydrated; // Hydration 완료 후에만 인증 UI 표시
  console.log("userLoggedIn", userLoggedIn);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto grid grid-cols-2 h-16 items-center px-4">
          {/* Left - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                StackLog
              </span>
            </Link>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center justify-end space-x-4">
            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {/* 로그인된 상태에서만 알림 배지 표시 */}
              {userLoggedIn && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[11px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              )}
              <span className="sr-only">알림</span>
            </Button>

            {/* 🔧 Hydration 완료 후에만 인증 UI 표시 */}
            {showAuthUI ? (
              userLoggedIn ? (
                // ✅ 로그인 후 UI
                <>
                  {/* 글쓰기 버튼 */}
                  <Button
                    variant="default"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <PenSquare className="mr-2 h-4 w-4" />
                    글쓰기
                  </Button>

                  {/* 사용자 드롭다운 */}
                  <UserDropdown />
                </>
              ) : (
                // ❌ 로그인 전 UI
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  로그인
                </Button>
              )
            ) : (
              // ⏳ Hydration 중 - 로딩 상태
              <div className="w-16 h-8 bg-gray-200 animate-pulse rounded-md" />
            )}
          </div>
        </div>
      </header>

      {/* 로그인 모달 */}
      {showAuthUI && (
        <LoginModal
          open={isLoginModalOpen}
          onOpenChange={setIsLoginModalOpen}
        />
      )}
    </>
  );
}
