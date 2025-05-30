// src/app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL에서 인증 코드 추출
        const codeParam = searchParams.get("code");
        const error = searchParams.get("error");

        // 에러가 있는 경우
        if (error) {
          setStatus("error");
          switch (error) {
            case "missing_code":
              setMessage(
                "인증 코드가 없습니다. 이메일 링크를 다시 확인해주세요."
              );
              break;
            case "invalid_code":
              setMessage("유효하지 않거나 만료된 인증 코드입니다.");
              break;
            default:
              setMessage("인증 처리 중 오류가 발생했습니다.");
          }
          return;
        }

        // 코드가 없는 경우
        if (!codeParam) {
          setStatus("error");
          setMessage(
            "인증 코드가 없습니다. 이메일 링크를 통해 다시 접근해주세요."
          );
          return;
        }

        console.log("✅ 인증 코드 수신:", codeParam);
        setCode(codeParam);

        // 성공 상태로 변경
        setStatus("success");
        setMessage("이메일 인증이 완료되었습니다! 프로필 정보를 입력해주세요.");

        // 2초 후 프로필 완성 페이지로 리다이렉트
        setTimeout(() => {
          router.push(`/complete-profile?code=${codeParam}`);
        }, 2000);
      } catch (error) {
        console.error("❌ 콜백 처리 실패:", error);
        setStatus("error");
        setMessage("처리 중 예상치 못한 오류가 발생했습니다.");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  // 로딩 상태
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-xl">🔍 인증 확인 중...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
              <p className="text-muted-foreground">
                이메일 인증을 확인하고 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 성공 상태
  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-xl text-green-600">
              ✅ 이메일 인증 완료!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <p className="text-muted-foreground">{message}</p>
              <div className="text-sm text-muted-foreground">
                2초 후 자동으로 이동합니다...
              </div>

              {/* 수동 이동 버튼 */}
              {code && (
                <Link href={`/complete-profile?code=${code}`}>
                  <Button className="w-full">
                    지금 바로 프로필 완성하기 🚀
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 에러 상태
  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">❌ 인증 실패</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-red-600 text-2xl">✗</span>
              </div>
              <p className="text-muted-foreground">{message}</p>

              <div className="space-y-2">
                <Link href="/login">
                  <Button className="w-full">다시 로그인하기</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    홈으로 돌아가기
                  </Button>
                </Link>
              </div>

              <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded">
                <strong>문제 해결 방법:</strong>
                <br />
                • 최신 이메일 링크를 사용하세요
                <br />
                • 링크가 1시간 이내에 사용되었는지 확인하세요
                <br />• 이메일 앱에서 링크를 직접 클릭하세요
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
