<!-- 인증 필요한 페이지에서:
typescript"use client";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WritePage() {
const { isAuthenticated } = useAuthStore();
const router = useRouter();

useEffect(() => {
if (!isAuthenticated()) {
router.push("/"); // 홈으로 이동 (로그인 모달)
}
}, [isAuthenticated, router]);

if (!isAuthenticated()) {
return null; // 리다이렉트 중
}

return (
<div>
<h1>글쓰기 페이지</h1>
{/_ 실제 콘텐츠 _/}
</div>
);
} -->
