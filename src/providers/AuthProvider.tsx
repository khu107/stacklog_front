"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { refreshAccessToken, hasAuthCookies } from "@/lib/api/auth";
import { getCurrentUser } from "@/lib/api/users";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { login, logout, hasHydrated, user } = useAuthStore();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 토큰 갱신 설정
  const setupAutoRefresh = () => {
    // 기존 타이머 제거
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // 14분마다 토큰 갱신 (15분 만료 전에)
    refreshIntervalRef.current = setInterval(async () => {
      if (!hasAuthCookies()) {
        logout();
        stopAutoRefresh();
        return;
      }

      try {
        await refreshAccessToken();
        console.log("토큰 자동 갱신 성공");
      } catch (error) {
        console.error("토큰 갱신 실패:", error);
        logout();
        stopAutoRefresh();
      }
    }, 14 * 60 * 1000); // 14분마다
  };

  // 동 갱신 중지
  const stopAutoRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  // 사용자 정보 복원 함수 (API 호출)
  const restoreUserFromCookie = async () => {
    try {
      const userInfo = await getCurrentUser();
      login(userInfo);
      setupAutoRefresh();
      console.log("사용자 정보 복원 성공:", userInfo.email);
    } catch (error) {
      console.error("사용자 정보 복원 실패:", error);
      logout();
      stopAutoRefresh();
    }
  };

  useEffect(() => {
    if (!hasHydrated) return;

    const checkAuthState = async () => {
      const hasCookies = hasAuthCookies();

      // 쿠키가 없는데 user가 있으면 로그아웃
      if (!hasCookies && user) {
        console.log("쿠키 없음 - 로그아웃 처리");
        logout();
        stopAutoRefresh();
        return;
      }

      // 쿠키도 있고 user도 있으면 그대로 유지
      if (hasCookies && user) {
        console.log("인증 상태 유지");
        setupAutoRefresh();
        return;
      }

      // 쿠키는 있는데 user가 없으면 복원
      if (hasCookies && !user) {
        console.log("쿠키 있음 - 사용자 정보 복원 시도");
        await restoreUserFromCookie();
        return;
      }

      // 쿠키도 없고 user도 없으면 → 정상 (로그인 안된 상태)
      if (!hasCookies && !user) {
        stopAutoRefresh();
      }
    };

    const timer = setTimeout(checkAuthState, 100);
    return () => clearTimeout(timer);
  }, [hasHydrated, user, login, logout]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      stopAutoRefresh();
    };
  }, []);

  return <>{children}</>;
}
