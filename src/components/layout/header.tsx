// src/components/layout/header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Bell, PenSquare } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import LoginModal from "../auth/login-register-modal";
import UserDropdown from "./user-dropdown";

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  // 클라이언트에서만 인증 상태 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  const userLoggedIn = isClient && isAuthenticated() && user;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto grid grid-cols-2 h-16 items-center px-4">
          {/* Left - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">D</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                dev_kundalik
              </span>
            </Link>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center justify-end space-x-4">
            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {/* 클라이언트에서만 알림 배지 표시 */}
              {userLoggedIn && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[11px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              )}
              <span className="sr-only">알림</span>
            </Button>

            {/* 로그인 상태에 따른 조건부 렌더링 */}
            {userLoggedIn ? (
              // 로그인 후 UI
              <>
                {/* 글쓰기 버튼 */}
                <Button variant="default" size="sm" className="hidden sm:flex">
                  <PenSquare className="mr-2 h-4 w-4" />
                  글쓰기
                </Button>

                {/* 사용자 드롭다운 */}
                <UserDropdown />
              </>
            ) : (
              // 로그인 전 UI (서버에서도 안전하게 렌더링)
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsLoginModalOpen(true)}
              >
                로그인
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 로그인 모달 */}
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  );
}
