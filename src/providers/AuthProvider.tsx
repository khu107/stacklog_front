// src/providers/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { login, hasHydrated, user } = useAuthStore();

  useEffect(() => {
    // Zustand 하이드레이션이 완료된 후 실행
    if (!hasHydrated) return;

    // 이미 사용자 정보가 있으면 복원 불필요
    if (user) return;

    // 토큰이 있는지 확인하고 사용자 정보 복원
    const restoreUserInfo = () => {
      console.log("🔍 전역 토큰 확인 중...");
      console.log("📋 전체 쿠키:", document.cookie);

      // 더 정확한 쿠키 확인
      const cookies = document.cookie.split(";").map((c) => c.trim());
      console.log("🍪 쿠키 목록:", cookies);

      const hasAccessToken = cookies.some(
        (cookie) => cookie.startsWith("accessToken=") && cookie.length > 15
      );

      console.log("🍪 토큰 존재:", hasAccessToken);

      if (hasAccessToken) {
        console.log("🔄 JWT에서 사용자 정보 추출 중...");

        // JWT 토큰에서 사용자 정보 추출
        const tokenCookie = cookies.find((c) => c.startsWith("accessToken="));
        if (tokenCookie) {
          const token = tokenCookie.split("=")[1];

          try {
            // JWT 디코딩 (페이로드 부분만)
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("🎯 전역 JWT 페이로드:", payload);

            const tempUser = {
              id: payload.sub,
              email: payload.email,
              displayName: payload.displayName,
              idname: payload.idname,
              avatarUrl: payload.avatarUrl,
              bio: null,
              status: (payload.idname ? "active" : "pending") as
                | "active"
                | "pending",
              emailVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            login(tempUser);
            console.log("✅ 전역 사용자 정보 복원 완료:", tempUser);
          } catch (error) {
            console.error("❌ 전역 JWT 디코딩 실패:", error);
          }
        }
      } else {
        console.log("ℹ️ 토큰 없음 - 로그인 상태 아님");
      }
    };

    // 약간의 지연 후 실행
    const timer = setTimeout(restoreUserInfo, 100);
    return () => clearTimeout(timer);
  }, [hasHydrated, user, login]);

  return <>{children}</>;
}
