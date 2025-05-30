// src/app/complete-profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { completeRegistration } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

export default function CompleteProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuthStore();

  const [code, setCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    profileName: "",
    userId: "",
    introduction: "",
  });

  // 🆕 URL에서 인증 코드 추출 (JWT 디코딩 제거)
  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setCode(codeParam);
      console.log("✅ 인증 코드 확인:", codeParam);
    } else {
      setError("인증 코드가 없습니다. 올바른 링크를 통해 접근해주세요.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      setError("인증 코드가 없습니다");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("🚀 회원가입 요청:", { code, formData });

      // 🆕 인증 코드로 회원가입 완료
      const result = await completeRegistration(code, formData);

      console.log("✅ 회원가입 완료:", result);

      // 🆕 Zustand에 로그인 정보 저장
      if (result.user && result.accessToken) {
        login(result.user, result.accessToken);
        console.log("✅ 자동 로그인 완료:", result.user.email);
      }

      setSuccess(true);

      // 3초 후 홈으로 리다이렉트
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("❌ 회원가입 실패:", error);
      setError(
        error instanceof Error ? error.message : "회원가입에 실패했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  // 로딩 상태
  if (!code && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">인증 코드를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 성공 상태
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">🎉 회원가입 완료!</CardTitle>
            <CardDescription>
              환영합니다! 곧 홈페이지로 이동합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <p className="text-sm text-muted-foreground">
                3초 후 자동으로 이동됩니다...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 프로필 입력 폼
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🎉 거의 다 끝났어요!</CardTitle>
          <CardDescription>
            프로필 정보를 입력해서 회원가입을 완료해주세요
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* 🗑️ 이메일 필드 제거 (JWT 디코딩 불가능) */}
            <div className="space-y-2">
              <Label htmlFor="profileName">프로필명 *</Label>
              <Input
                id="profileName"
                type="text"
                placeholder="개발자 홍길동"
                value={formData.profileName}
                onChange={handleInputChange("profileName")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">
                사용자 ID * (영문, 숫자, 언더스코어만)
              </Label>
              <Input
                id="userId"
                type="text"
                placeholder="hong_developer"
                value={formData.userId}
                onChange={handleInputChange("userId")}
                pattern="[a-zA-Z0-9_-]+"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="introduction">소개 (선택)</Label>
              <Input
                id="introduction"
                type="text"
                placeholder="안녕하세요! 개발을 좋아하는 홍길동입니다."
                value={formData.introduction}
                onChange={handleInputChange("introduction")}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formData.profileName || !formData.userId}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  <span>회원가입 중...</span>
                </div>
              ) : (
                "🚀 회원가입 완료!"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
