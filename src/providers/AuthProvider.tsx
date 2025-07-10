"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { hasAuthCookies } from "@/lib/api/auth";
import { useCurrentUser } from "@/hooks/useUsers";
import { useRefreshToken } from "@/hooks/useAuth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { login, clearUser, hasHydrated, user } = useAuthStore();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // React Query 훅들 사용
  const { refetch: fetchCurrentUser } = useCurrentUser();
  const refreshTokenMutation = useRefreshToken();

  // 자동 토큰 갱신 설정
  const setupAutoRefresh = () => {
    // 기존 타이머 제거
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    console.log("🔄 18분 자동 갱신 타이머 시작");

    // 14분마다 토큰 갱신 (15분 만료 전에)
    refreshIntervalRef.current = setInterval(async () => {
      console.log("⏰ 18분 경과! 토큰 갱신 시도");
      if (!hasAuthCookies()) {
        console.log("❌ 쿠키 없음 - 갱신 중단");
        clearUser();
        stopAutoRefresh();
        return;
      }

      try {
        // React Query mutation 사용
        console.log("🔄 refreshToken API 호출...");
        await refreshTokenMutation.mutateAsync();
        console.log("토큰 자동 갱신 성공");
      } catch (error) {
        console.error("❌ 토큰 갱신 실패:", error);
        console.log("❌ 갱신 실패로 로그아웃 처리");
        clearUser();
        stopAutoRefresh();
      }
    }, 18 * 60 * 1000); // 18 분마다
  };

  // 자동 갱신 중지
  const stopAutoRefresh = () => {
    if (refreshIntervalRef.current) {
      console.log("⏸️ 자동 갱신 타이머 중단");
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  // 사용자 정보 복원 함수 (React Query 사용)
  const restoreUserFromCookie = async () => {
    try {
      // ✅ React Query refetch 사용
      const { data: userInfo } = await fetchCurrentUser();
      if (userInfo) {
        login(userInfo);
        setupAutoRefresh();
        console.log("사용자 정보 복원 성공:", userInfo.email);
      }
    } catch (error) {
      console.error("사용자 정보 복원 실패:", error);
      clearUser();
      stopAutoRefresh();
    }
  };

  useEffect(() => {
    if (!hasHydrated) return;

    const checkAuthState = async () => {
      const hasCookies = hasAuthCookies();
      console.log("🔍 인증 상태 체크 - 쿠키:", hasCookies, "사용자:", !!user);

      // 쿠키가 없는데 user가 있으면 로그아웃
      if (!hasCookies && user) {
        console.log("🚪 쿠키 없음 + 사용자 있음 = 로그아웃");
        clearUser();
        stopAutoRefresh();
        return;
      }

      // 쿠키도 있고 user도 있으면 그대로 유지
      if (hasCookies && user) {
        console.log("✨ 정상 상태 - 자동 갱신 시작");
        setupAutoRefresh();
        return;
      }

      // 쿠키는 있는데 user가 없으면 복원
      if (hasCookies && !user) {
        console.log("🔄 쿠키 있음 + 사용자 없음 = 복원 시도");
        await restoreUserFromCookie();
        return;
      }

      // 쿠키도 없고 user도 없으면 → 정상 (로그인 안된 상태)
      if (!hasCookies && !user) {
        console.log("😐 로그아웃 상태");
        stopAutoRefresh();
      }
    };

    const timer = setTimeout(checkAuthState, 100);
    return () => clearTimeout(timer);
  }, [hasHydrated, user, login, clearUser]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      stopAutoRefresh();
    };
  }, []);

  return <>{children}</>;
}
