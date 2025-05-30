// src/components/layout/user-dropdown.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { logout as logoutAPI } from "@/lib/api/auth";

export default function UserDropdown() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    console.log("🚪 로그아웃 실행");

    try {
      // 1. 서버에 로그아웃 요청 (refreshToken 쿠키 삭제)
      await logoutAPI();
      console.log("✅ 서버 로그아웃 완료 - 쿠키 삭제됨");

      // 2. 클라이언트 상태 초기화
      logout();
      console.log("✅ 클라이언트 상태 초기화 완료");

      // 3. 홈페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("❌ 로그아웃 중 오류:", error);
      // 에러가 있어도 클라이언트 상태는 초기화
      logout();
      router.push("/");
    }
  };

  const handleProfile = () => {
    console.log("👤 프로필 페이지로 이동");
    // router.push("/profile");
  };

  const handleSettings = () => {
    console.log("⚙️ 설정 페이지로 이동");
    // router.push("/settings");
  };

  const getUserInitials = () => {
    if (user.profileName) {
      return user.profileName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user.profileName || user.email} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.profileName || "사용자"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{user.userId}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>프로필</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>설정</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
