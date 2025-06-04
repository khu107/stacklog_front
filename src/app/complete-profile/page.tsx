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
import { completeProfile, checkIdnameAvailable } from "@/lib/api/auth";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, updateUser, needsProfileSetup } = useAuthStore();

  const [idname, setIdname] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [idnameStatus, setIdnameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [errors, setErrors] = useState<{ idname?: string; general?: string }>(
    {}
  );

  // AuthProvider에서 이미 JWT 복원을 처리하므로 간단하게 처리
  useEffect(() => {
    setIsCheckingAuth(false);
  }, []);

  // 인증 상태 확인 (AuthProvider에서 사용자 정보 복원 완료 후)
  useEffect(() => {
    if (isCheckingAuth) return;

    if (!user) {
      router.push("/");
      return;
    }

    if (!needsProfileSetup()) {
      router.push("/");
      return;
    }
  }, [user, needsProfileSetup, router, isCheckingAuth]);

  // 🔧 실제 API를 사용한 idname 중복 체크
  useEffect(() => {
    if (idname.length < 2) {
      setIdnameStatus("idle");
      return;
    }

    // 기본 유효성 검사
    const isValidFormat = /^[a-zA-Z0-9_-]+$/.test(idname);
    if (!isValidFormat) {
      setIdnameStatus("idle");
      setErrors({
        ...errors,
        idname: "영문, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다",
      });
      return;
    }

    // 예약어 체크
    const reservedWords = [
      "admin",
      "api",
      "www",
      "root",
      "test",
      "null",
      "undefined",
    ];
    if (reservedWords.includes(idname.toLowerCase())) {
      setIdnameStatus("taken");
      setErrors({
        ...errors,
        idname: "사용할 수 없는 사용자 ID입니다",
      });
      return;
    }

    setErrors({ ...errors, idname: undefined });
    setIdnameStatus("checking");

    const timeoutId = setTimeout(async () => {
      try {
        // 실제 백엔드 API 호출
        const result = await checkIdnameAvailable(idname);

        if (result.isAvailable) {
          setIdnameStatus("available");
          setErrors({ ...errors, idname: undefined });
        } else {
          setIdnameStatus("taken");
          setErrors({
            ...errors,
            idname: result.message || "이미 사용 중인 사용자 ID입니다",
          });
        }
      } catch (error) {
        setIdnameStatus("idle");
        setErrors({
          ...errors,
          idname: "ID 확인 중 오류가 발생했습니다",
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [idname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔧 더 엄격한 검증
    if (idnameStatus === "checking") {
      setErrors({ ...errors, general: "ID 확인이 완료될 때까지 기다려주세요" });
      return;
    }

    if (idnameStatus !== "available") {
      setErrors({ ...errors, general: "사용 가능한 ID를 입력해주세요" });
      return;
    }

    if (!idname.trim()) {
      setErrors({ ...errors, general: "사용자 ID를 입력해주세요" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // 최종 중복 체크 (제출 직전)
      const finalCheck = await checkIdnameAvailable(idname);

      if (!finalCheck.isAvailable) {
        setErrors({
          general: "다른 사용자가 방금 사용한 ID입니다. 다른 ID를 선택해주세요",
        });
        setIdnameStatus("taken");
        return;
      }

      const result = await completeProfile({ idname, bio });

      updateUser(result.user);

      router.push("/");
    } catch (error) {
      setErrors({
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
        return { text: "서버에서 확인 중...", color: "text-blue-500" };
      case "available":
        return { text: "✅ 사용 가능한 ID입니다", color: "text-green-600" };
      case "taken":
        return null; // 에러 메시지에서 표시하므로 여기서는 제거
      default:
        return null;
    }
  };

  // 로딩 상태
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
              {/* 🔧 사용자 ID 입력 개선 */}
              <div>
                <Label htmlFor="idname">사용자 ID *</Label>
                <Input
                  id="idname"
                  name="idname"
                  type="text"
                  value={idname}
                  onChange={(e) => setIdname(e.target.value)}
                  placeholder="영문, 숫자, _, - 사용 가능"
                  required
                  minLength={2}
                  maxLength={20}
                  autoComplete="username"
                  disabled={isLoading}
                  className={`mt-1 transition-colors ${
                    idnameStatus === "available"
                      ? "border-green-500 focus:border-green-500 bg-green-50"
                      : idnameStatus === "taken" || errors.idname
                      ? "border-red-500 focus:border-red-500 bg-red-50"
                      : idnameStatus === "checking"
                      ? "border-blue-500 focus:border-blue-500 bg-blue-50"
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
                  name="bio"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="당신을 한 줄로 소개해보세요 (선택사항)"
                  maxLength={100}
                  autoComplete="off"
                  disabled={isLoading}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">{bio.length}/100자</p>
              </div>

              {/* 에러 메시지 */}
              {errors.general && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
                  {errors.general}
                </div>
              )}

              {/* 완료 버튼 */}
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoading || idnameStatus !== "available" || !idname.trim()
                }
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
