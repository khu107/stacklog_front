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
import { User, BookOpen, PenTool, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
      logout();
      router.push("/");
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

  const getUserInitials = () => {
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
            <AvatarImage
              className="object-cover object-center"
              src={user.avatarUrl || ""}
              alt="프로필"
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials()}
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
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
