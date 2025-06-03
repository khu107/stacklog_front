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

export default function UserDropdown() {
  const { user, logout, needsProfileSetup } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout(); // async 함수이므로 await 추가
      router.push("/");
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
      // 오류가 발생해도 강제 로그아웃
      logout();
      router.push("/");
    }
  };

  const handleProfile = () => {
    if (user.idname) {
      router.push(`/@${user.idname}`);
    } else {
      router.push("/profile");
    }
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const getUserInitials = () => {
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    return user.displayName || "사용자";
  };

  const getUserId = () => {
    return user.idname || "설정 필요";
  };

  // 🔧 profileCompleted 대신 needsProfileSetup() 사용
  const profileIncomplete = needsProfileSetup();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl || ""} alt={getDisplayName()} />
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
              {getDisplayName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{getUserId()}
            </p>
            {/* 🔧 상태 표시 개선 */}
            <p className="text-xs leading-none text-muted-foreground">
              상태:{" "}
              {user.status === "pending" ? "프로필 설정 필요" : "활성화됨"}
            </p>
            {profileIncomplete && (
              <p className="text-xs leading-none text-amber-600">
                프로필 설정이 필요합니다
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* 🔧 라우팅 경로 수정 */}
        {profileIncomplete && (
          <>
            <DropdownMenuItem
              onClick={() => router.push("/complete-profile")}
              className="text-amber-600"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>프로필 설정 완료하기</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

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
