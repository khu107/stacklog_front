"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Github } from "lucide-react";
import {
  startGithubLogin,
  startGoogleLogin,
  startNaverLogin,
} from "@/lib/api/auth";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 개별 함수들을 하나로 통합
  const handleSocialLogin = (provider: "google" | "naver" | "github") => {
    setIsLoading(true);

    switch (provider) {
      case "google":
        startGoogleLogin();
        break;
      case "naver":
        startNaverLogin();
        break;
      case "github":
        startGithubLogin();
        break;
      default:
        console.log(`${provider} 로그인 - 지원하지 않는 제공자`);
        alert("지원하지 않는 로그인 방식입니다.");
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            dev_kundalik에 로그인
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            소셜 계정으로 간편하게 로그인하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>로그인 중...</span>
                </div>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google로 계속하기
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("github")}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub로 계속하기
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("naver")}
              disabled={isLoading}
            >
              <div className="mr-2 h-4 w-4 rounded bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">N</span>
              </div>
              네이버로 계속하기
            </Button>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          계속 진행하면{" "}
          <a href="#" className="underline hover:text-foreground">
            서비스 약관
          </a>
          과{" "}
          <a href="#" className="underline hover:text-foreground">
            개인정보 처리방침
          </a>
          에 동의하는 것으로 간주됩니다.
        </div>
      </DialogContent>
    </Dialog>
  );
}
