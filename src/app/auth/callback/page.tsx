// app/auth/callback/page.tsx (경로 수정)
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const needsSetup = searchParams.get("needsSetup");

    console.log("📥 콜백 페이지 도착:", { needsSetup });

    if (needsSetup === "true") {
      // PENDING 상태 → 프로필 설정 페이지로
      console.log("🔄 프로필 설정 페이지로 이동...");
      router.push("/complete-profile");
    } else if (needsSetup === "false") {
      // ACTIVE 상태 → 홈으로
      console.log("🏠 홈으로 이동...");
      router.push("/");
    } else {
      // 잘못된 접근
      console.error("❌ 잘못된 콜백 접근:", needsSetup);
      router.push("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
