// components/settings/DangerZone.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Trash2, Loader2 } from "lucide-react";
import { useDeleteAccount } from "@/hooks/useUsers";

export default function DangerZone() {
  // ✅ React Query 훅 사용
  const deleteAccountMutation = useDeleteAccount();

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm("회원 탈퇴: 정말로 탈퇴하시겠습니까?");
    if (!confirmation) return;

    const doubleConfirmation = window.confirm(
      "마지막 확인: 이 작업은 되돌릴 수 없습니다. 정말로 계정을 삭제하시겠습니까?"
    );
    if (!doubleConfirmation) return;

    try {
      // ✅ React Query mutation 실행
      await deleteAccountMutation.mutateAsync();
      // 성공 시 리다이렉트는 useDeleteAccount 훅에서 처리
    } catch (err) {
      console.error("❌ 계정 삭제 실패:", err);
      alert(
        err instanceof Error
          ? err.message
          : "계정 삭제에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-red-50/50 backdrop-blur-sm border-red-200">
      <CardHeader>
        <CardTitle className="text-red-700 flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-red-600" />
          </div>
          위험 구역
        </CardTitle>
        <CardDescription className="text-red-600">
          이 작업들은 되돌릴 수 없습니다. 신중하게 진행하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
          <div>
            <h4 className="font-semibold text-gray-900">계정 삭제</h4>
            <p className="text-sm text-gray-600">
              모든 데이터가 영구적으로 삭제됩니다
            </p>
          </div>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDeleteAccount}
            disabled={deleteAccountMutation.isPending}
          >
            {deleteAccountMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {deleteAccountMutation.isPending ? "삭제 중..." : "계정 삭제"}
          </Button>
        </div>

        {/* ✅ 에러 상태 표시 (선택사항) */}
        {deleteAccountMutation.error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              {deleteAccountMutation.error.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
