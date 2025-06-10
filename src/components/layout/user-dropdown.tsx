"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  BookOpen,
  PenTool,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { getAvatarFallback, getAvatarUrl } from "@/lib/utils";
import { useLogout } from "@/hooks/useAuth";

export default function UserDropdown() {
  const { user } = useAuthStore();
  const router = useRouter();
  const logoutMutation = useLogout();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // 성공 시 리다이렉트는 useLogout 훅에서 처리
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
      // 에러 발생 시에도 홈으로 리다이렉트 (useLogout 훅에서 처리)
    }
  };

  const handleMyBlog = () => {
    if (user.idname) {
      router.push(`/@${user.idname}/posts`);
    } else {
      router.push("/profile");
    }
  };

  const handleWritePost = () => {
    router.push("/write");
  };

  const handleReadingList = () => {
    router.push("/reading-list");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getAvatarUrl(user.avatarUrl)} alt="프로필" />
            <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getAvatarFallback(user)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem onClick={handleMyBlog}>
          <User className="mr-2 h-4 w-4" />
          <span>내 블로그</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWritePost}>
          <PenTool className="mr-2 h-4 w-4" />
          <span>임시 글</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleReadingList}>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>읽기 목록</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>설정</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600"
          disabled={logoutMutation.isPending}
        >
          {/*로딩 상태 표시 */}
          {logoutMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>
            {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
