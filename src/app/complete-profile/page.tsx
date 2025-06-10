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
import { useCompleteProfile } from "@/hooks/useAuth";
import { useCheckIdname } from "@/hooks/useUsers";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, needsProfileSetup } = useAuthStore();

  const [idname, setIdname] = useState("");
  const [bio, setBio] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [errors, setErrors] = useState<{ idname?: string; general?: string }>(
    {}
  );

  // React Query 훅들 사용
  const completeProfileMutation = useCompleteProfile();
  const { data: idnameCheck, isLoading: isCheckingIdname } =
    useCheckIdname(idname);

  // AuthProvider에서 이미 JWT 복원을 처리하므로 간단하게 처리
  useEffect(() => {
    setIsCheckingAuth(false);
  }, []);

  // 인증 상태 확인
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

  // idname 유효성 검사 (React Query 결과 활용)
  useEffect(() => {
    if (idname.length < 2) {
      setErrors((prev) => ({ ...prev, idname: undefined }));
      return;
    }

    // 기본 유효성 검사
    const isValidFormat = /^[a-zA-Z0-9_-]+$/.test(idname);
    if (!isValidFormat) {
      setErrors((prev) => ({
        ...prev,
        idname: "영문, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다",
      }));
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
      setErrors((prev) => ({
        ...prev,
        idname: "사용할 수 없는 사용자 ID입니다",
      }));
      return;
    }

    // React Query에서 결과 받아서 처리
    if (idnameCheck) {
      if (idnameCheck.isAvailable) {
        setErrors((prev) => ({ ...prev, idname: undefined }));
      } else {
        setErrors((prev) => ({
          ...prev,
          idname: idnameCheck.message || "이미 사용 중인 사용자 ID입니다",
        }));
      }
    }
  }, [idname, idnameCheck]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // React Query 상태로 검증
    if (isCheckingIdname) {
      setErrors((prev) => ({
        ...prev,
        general: "ID 확인이 완료될 때까지 기다려주세요",
      }));
      return;
    }

    if (!idnameCheck?.isAvailable) {
      setErrors((prev) => ({
        ...prev,
        general: "사용 가능한 ID를 입력해주세요",
      }));
      return;
    }

    if (!idname.trim()) {
      setErrors((prev) => ({ ...prev, general: "사용자 ID를 입력해주세요" }));
      return;
    }

    setErrors({});

    try {
      // React Query mutation 사용
      await completeProfileMutation.mutateAsync({ idname, bio });

      // 성공 시 홈으로 이동 (useCompleteProfile 훅에서 store 업데이트 처리)
      router.push("/");
    } catch (error) {
      setErrors({
        general:
          error instanceof Error ? error.message : "프로필 설정에 실패했습니다",
      });
    }
  };

  // idname 상태 메시지 (React Query 상태 기반)
  const getIdnameStatusMessage = () => {
    if (idname.length < 2) return null;

    if (isCheckingIdname) {
      return { text: "서버에서 확인 중...", color: "text-blue-500" };
    }

    if (idnameCheck?.isAvailable && !errors.idname) {
      return { text: "사용 가능한 ID입니다", color: "text-green-600" };
    }

    return null; // 에러는 errors.idname에서 표시
  };

  // idname 상태 계산 (React Query 기반)
  const getIdnameStatus = () => {
    if (idname.length < 2) return "idle";
    if (isCheckingIdname) return "checking";
    if (errors.idname) return "taken";
    if (idnameCheck?.isAvailable) return "available";
    return "idle";
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
  const idnameStatus = getIdnameStatus();

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
              {/* 사용자 ID 입력 */}
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
                  disabled={completeProfileMutation.isPending}
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
                  disabled={completeProfileMutation.isPending}
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

              {/* React Query 에러 표시 */}
              {completeProfileMutation.error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
                  {completeProfileMutation.error.message}
                </div>
              )}

              {/* 완료 버튼 */}
              <Button
                type="submit"
                className="w-full"
                disabled={
                  completeProfileMutation.isPending ||
                  idnameStatus !== "available" ||
                  !idname.trim()
                }
              >
                {completeProfileMutation.isPending ? (
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
