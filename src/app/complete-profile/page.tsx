// src/app/complete-profile/page.tsx (완전 수정 버전)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";
import { completeGoogleProfile } from "@/lib/api/auth";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, updateUser, needsProfileSetup, login } = useAuthStore(); // 🔧 수정된 store 함수들

  const [idname, setIdname] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // 🆕 인증 확인 중
  const [idnameStatus, setIdnameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [errors, setErrors] = useState<{ idname?: string; general?: string }>(
    {}
  );

  // 🆕 개선된 쿠키 확인 로직
  useEffect(() => {
    const checkTokenAndCreateUser = () => {
      console.log("🔍 토큰 확인 중...");
      console.log("📋 전체 쿠키:", document.cookie);

      // 더 정확한 쿠키 확인
      const cookies = document.cookie.split(";").map((c) => c.trim());
      console.log("🍪 쿠키 목록:", cookies);

      const hasAccessToken = cookies.some(
        (cookie) => cookie.startsWith("accessToken=") && cookie.length > 15
      );

      console.log("🍪 토큰 존재:", hasAccessToken);

      if (hasAccessToken && !user) {
        console.log("🔄 JWT에서 사용자 정보 추출 중...");

        // JWT 토큰에서 사용자 정보 추출
        const tokenCookie = cookies.find((c) => c.startsWith("accessToken="));
        if (tokenCookie) {
          const token = tokenCookie.split("=")[1];

          try {
            // JWT 디코딩 (페이로드 부분만)
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("🎯 JWT 페이로드:", payload);

            const tempUser = {
              id: payload.sub,
              email: payload.email,
              displayName: payload.displayName,
              idname: payload.idname,
              avatarUrl: payload.avatarUrl,
              bio: null,
              status: (payload.idname ? "active" : "pending") as
                | "active"
                | "pending", // 🔧 소문자로 수정
              emailVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            login(tempUser);
            console.log("✅ JWT에서 사용자 정보 복원 완료:", tempUser);
          } catch (error) {
            console.error("❌ JWT 디코딩 실패:", error);
          }
        }
      }

      setIsCheckingAuth(false);
    };

    // 약간의 지연 후 실행 (하이드레이션 완료 대기)
    const timer = setTimeout(checkTokenAndCreateUser, 100);
    return () => clearTimeout(timer);
  }, [user, login]);

  // 🔧 수정된 인증 검증 로직
  useEffect(() => {
    if (isCheckingAuth) return; // 인증 확인 중이면 대기

    console.log("🔐 인증 상태 확인:", { user: !!user, isCheckingAuth });

    if (!user) {
      console.log("❌ 사용자 정보 없음 → 홈으로 이동");
      router.push("/");
      return;
    }

    // 이미 프로필이 완성된 사용자라면 홈으로
    if (!needsProfileSetup()) {
      console.log("✅ 프로필 이미 완성 → 홈으로 이동");
      router.push("/");
      return;
    }

    console.log("🎯 프로필 설정 페이지 유지");
  }, [user, needsProfileSetup, router, isCheckingAuth]);

  // idname 중복 체크 (디바운스)
  useEffect(() => {
    if (idname.length < 2) {
      setIdnameStatus("idle");
      return;
    }

    // 영문, 숫자, 언더스코어, 하이픈만 허용
    const isValidFormat = /^[a-zA-Z0-9_-]+$/.test(idname);
    if (!isValidFormat) {
      setIdnameStatus("idle");
      setErrors({
        ...errors,
        idname: "영문, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다",
      });
      return;
    }

    setErrors({ ...errors, idname: undefined });
    setIdnameStatus("checking");

    const timeoutId = setTimeout(async () => {
      try {
        // 🔧 임시로 모든 idname을 사용 가능으로 처리 (백엔드 API 없음)
        setIdnameStatus("available");

        // TODO: 나중에 실제 API 호출로 변경
        // const result = await checkIdnameAvailable(idname);
        // setIdnameStatus(result.isAvailable ? "available" : "taken");
      } catch (error) {
        console.error("ID 중복 체크 에러:", error);
        setIdnameStatus("idle");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [idname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (idnameStatus !== "available") {
      setErrors({ ...errors, general: "사용 가능한 ID를 입력해주세요" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log("📝 프로필 설정 요청:", { idname, bio });

      // 🔧 쿠키 기반 API 호출 (accessToken 파라미터 제거)
      const result = await completeGoogleProfile({ idname, bio });

      // 사용자 정보 업데이트
      updateUser(result.user);

      console.log("✅ 프로필 설정 완료:", result.user);

      // 성공 시 홈으로 이동
      router.push("/");
    } catch (error) {
      console.error("❌ 프로필 완성 에러:", error);
      setErrors({
        ...errors,
        general:
          error instanceof Error ? error.message : "프로필 설정에 실패했습니다",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getIdnameStatusMessage = () => {
    switch (idnameStatus) {
      case "checking":
        return { text: "확인 중...", color: "text-gray-500" };
      case "available":
        return { text: "사용 가능한 ID입니다", color: "text-green-600" };
      case "taken":
        return { text: "이미 사용 중인 ID입니다", color: "text-red-600" };
      default:
        return null;
    }
  };

  // 🔧 로딩 상태 개선
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  const statusMessage = getIdnameStatusMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            프로필 설정
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            마지막 단계입니다! 사용자 ID와 소개를 입력해주세요.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">환영합니다!</CardTitle>
            <CardDescription className="text-center">
              {user.email}로 로그인하셨습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 사용자 ID */}
              <div>
                <Label htmlFor="idname">사용자 ID *</Label>
                <Input
                  id="idname"
                  type="text"
                  value={idname}
                  onChange={(e) => setIdname(e.target.value)}
                  placeholder="영문, 숫자, _, - 사용 가능"
                  required
                  minLength={2}
                  maxLength={20}
                  className={`mt-1 ${
                    idnameStatus === "available"
                      ? "border-green-500"
                      : idnameStatus === "taken"
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {statusMessage && (
                  <p className={`text-sm mt-1 ${statusMessage.color}`}>
                    {statusMessage.text}
                  </p>
                )}
                {errors.idname && (
                  <p className="text-sm text-red-600 mt-1">{errors.idname}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  이 ID는 yoursite.com/@{idname || "userid"} 형태의 프로필 URL이
                  됩니다
                </p>
              </div>

              {/* 자기소개 */}
              <div>
                <Label htmlFor="bio">한 줄 소개</Label>
                <Input
                  id="bio"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="당신을 한 줄로 소개해보세요 (선택사항)"
                  maxLength={100}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">{bio.length}/100자</p>
              </div>

              {/* 에러 메시지 */}
              {errors.general && (
                <div className="text-red-600 text-sm text-center">
                  {errors.general}
                </div>
              )}

              {/* 완료 버튼 */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || idnameStatus !== "available" || !idname}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>설정 중...</span>
                  </div>
                ) : (
                  "프로필 설정 완료"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
