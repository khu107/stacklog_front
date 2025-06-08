"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { refreshAccessToken } from "@/lib/api/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { login, logout, hasHydrated, user } = useAuthStore();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔍 쿠키 상태 확인 함수
  const checkCookieStatus = () => {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const accessTokenCookie = cookies.find((c) => c.startsWith("accessToken="));
    const refreshTokenCookie = cookies.find((c) =>
      c.startsWith("refreshToken=")
    );

    return {
      hasAccessToken: !!accessTokenCookie,
      hasRefreshToken: !!refreshTokenCookie,
    };
  };

  // 🔄 자동 토큰 갱신 설정
  const setupAutoRefresh = () => {
    // 기존 타이머 제거
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // 14분마다 토큰 갱신 (15분 만료 전에)
    refreshIntervalRef.current = setInterval(async () => {
      const beforeRefresh = checkCookieStatus();

      if (!beforeRefresh.hasRefreshToken) {
        logout();
        stopAutoRefresh();
        return;
      }

      try {
        await refreshAccessToken();
      } catch (error) {
        logout();
        stopAutoRefresh();
      }
    }, 14 * 60 * 1000); // 14분마다
  };

  // 🛑 자동 갱신 중지
  const stopAutoRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!hasHydrated) return;

    const checkAuthState = () => {
      const cookieStatus = checkCookieStatus();

      // 쿠키가 없는데 user가 있으면 로그아웃
      if (!cookieStatus.hasAccessToken && user) {
        logout();
        stopAutoRefresh();
        return;
      }

      // 쿠키도 있고 user도 있으면 그대로 유지
      if (cookieStatus.hasAccessToken && user) {
        setupAutoRefresh(); // 자동 갱신 시작
        return;
      }

      // 쿠키는 있는데 user가 없으면 복원
      if (cookieStatus.hasAccessToken && !user) {
        const cookies = document.cookie.split(";").map((c) => c.trim());
        const tokenCookie = cookies.find((c) => c.startsWith("accessToken="));

        if (tokenCookie) {
          const token = tokenCookie.split("=")[1];

          try {
            const payload = JSON.parse(atob(token.split(".")[1]));

            const tempUser = {
              id: payload.sub,
              email: payload.email,
              displayName: payload.displayName,
              idname: payload.idname,
              avatarUrl: payload.avatarUrl,
              bio: payload.bio,
              status: (payload.idname ? "active" : "pending") as
                | "active"
                | "pending",
              emailVerified: true,
            };

            login(tempUser);
            setupAutoRefresh(); // 자동 갱신 시작
          } catch (error) {
            console.error("❌ JWT 디코딩 실패:", error);
            logout();
            stopAutoRefresh();
          }
        }
      }

      // 쿠키도 없고 user도 없으면 → 정상 (로그인 안된 상태)
      if (!cookieStatus.hasAccessToken && !user) {
        stopAutoRefresh();
      }
    };

    const timer = setTimeout(checkAuthState, 100);
    return () => clearTimeout(timer);
  }, [hasHydrated, user, login, logout]);

  // 🧹 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      stopAutoRefresh();
    };
  }, []);

  return <>{children}</>;
}
