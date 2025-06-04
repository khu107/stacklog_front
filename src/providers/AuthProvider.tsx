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
    if (!hasHydrated) return;

    if (user) return;

    const restoreUserInfo = () => {
      const cookies = document.cookie.split(";").map((c) => c.trim());

      const hasAccessToken = cookies.some(
        (cookie) => cookie.startsWith("accessToken=") && cookie.length > 15
      );

      if (hasAccessToken) {
        // JWT 토큰에서 사용자 정보 추출
        const tokenCookie = cookies.find((c) => c.startsWith("accessToken="));
        if (tokenCookie) {
          const token = tokenCookie.split("=")[1];

          try {
            // JWT 디코딩 (페이로드 부분만)
            const payload = JSON.parse(atob(token.split(".")[1]));

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
