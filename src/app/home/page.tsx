// src/app/home/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    user,
    accessToken,
    isLoading,
    login,
    logout,
    setLoading,
    isAuthenticated,
  } = useAuthStore();

  useEffect(() => {
    const handleTokensFromURL = () => {
      setLoading(true);

      // URL에서 토큰 확인
      const urlAccessToken = searchParams.get("accessToken");
      const urlRefreshToken = searchParams.get("refreshToken");

      if (urlAccessToken && urlRefreshToken) {
        console.log("🔗 URL에서 새 토큰 발견 - 로그인 처리");

        try {
          // 토큰에서 사용자 정보 추출
          const payload = JSON.parse(atob(urlAccessToken.split(".")[1]));
          console.log("🔍 토큰 페이로드:", payload);

          // 실제 사용자 정보로 설정 (서버에서 받은 데이터 기반)
          const userData = {
            id: payload.sub,
            email: payload.email,
            profileName: payload.profileName || "사용자",
            userId: payload.userId || `user_${payload.sub}`,
            introduction: payload.introduction || "",
            isVerified: true,
          };

          // Zustand에 저장
          login(userData, urlAccessToken, urlRefreshToken);

          // URL에서 토큰 제거 (보안)
          router.replace("/home");
        } catch (error) {
          console.error("❌ 토큰 파싱 에러:", error);
          router.push("/");
        }
      } else {
        // URL에 토큰이 없는 경우
        console.log("📱 URL에 토큰 없음 - 저장된 인증 상태 확인");

        if (!isAuthenticated()) {
          console.log("❌ 인증되지 않음 - 홈으로 리다이렉트");
          router.push("/");
        } else {
          console.log("✅ 저장된 인증 상태로 접속");
        }
      }

      setLoading(false);
    };

    handleTokensFromURL();
  }, [searchParams, router, login, setLoading, isAuthenticated]);

  const handleLogout = () => {
    console.log("🚪 로그아웃 실행");
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">인증 처리 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated() || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">로그인이 필요합니다</h1>
          <p className="text-muted-foreground mb-4">
            올바른 링크를 통해 접근해주세요.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">🎉 환영합니다!</h1>
            <p className="text-muted-foreground">
              {user.email}님, dev_kundalik에 오신 것을 환영합니다.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>

        {/* 메인 카드들 */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              📝 첫 번째 글 작성하기
            </h2>
            <p className="text-muted-foreground mb-4">
              개발 일지를 시작해보세요!
            </p>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              글 작성하기
            </button>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">👤 프로필 설정</h2>
            <p className="text-muted-foreground mb-4">
              프로필을 더 자세히 설정해보세요.
            </p>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90">
              프로필 수정
            </button>
          </div>
        </div>

        {/* 인증 상태 정보 */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">👤 사용자 정보</h3>
            <div className="space-y-1 text-sm">
              <div>
                <strong>ID:</strong> {user.id}
              </div>
              <div>
                <strong>이메일:</strong> {user.email}
              </div>
              <div>
                <strong>프로필명:</strong> {user.profileName}
              </div>
              <div>
                <strong>사용자 ID:</strong> {user.userId}
              </div>
              <div>
                <strong>인증:</strong> {user.isVerified ? "✅" : "❌"}
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">🔐 토큰 정보</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>
                <strong>액세스 토큰:</strong> {accessToken?.substring(0, 20)}...
              </div>
              <div>
                <strong>저장소:</strong> localStorage (자동 복원)
              </div>
              <div>
                <strong>상태:</strong> {isAuthenticated() ? "인증됨" : "미인증"}
              </div>
            </div>
          </div>
        </div>

        {/* 로그 표시 */}
        <div className="mt-4 p-4 bg-black text-green-400 rounded-lg font-mono text-xs">
          <div>✅ Zustand 토큰 관리 시스템 활성화</div>
          <div>💾 localStorage 자동 저장/복원</div>
          <div>🔄 새로고침해도 로그인 상태 유지</div>
          <div>👤 현재 사용자: {user.email}</div>
        </div>
      </div>
    </div>
  );
}
