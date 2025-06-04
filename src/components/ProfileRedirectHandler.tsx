"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function ProfileRedirectHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // PENDING 상태이고 프로필 완성 페이지가 아니면 리다이렉트
    if (user?.status === "pending" && pathname !== "/complete-profile") {
      console.log(
        "🔄 PENDING 상태 사용자 리다이렉트:",
        pathname,
        "→ /complete-profile"
      );
      router.push("/complete-profile");
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
