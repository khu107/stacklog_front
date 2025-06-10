import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { authApi, type AuthResponse, type ProfileData } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

// 프로필 완성
export const useCompleteProfile = (): UseMutationResult<
  AuthResponse,
  Error,
  ProfileData,
  unknown
> => {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();

  return useMutation<AuthResponse, Error, ProfileData>({
    mutationFn: authApi.completeProfile,
    onSuccess: (data: AuthResponse) => {
      // Zustand store 업데이트
      login(data.user);
      // React Query 캐시 업데이트
      queryClient.setQueryData(["currentUser"], data.user);

      console.log("프로필 설정 완료:", data);
    },
    onError: (error: Error) => {
      console.error("프로필 설정 실패:", error);
    },
  });
};

// 토큰 갱신
export const useRefreshToken = (): UseMutationResult<
  { success: boolean },
  Error,
  void,
  unknown
> => {
  return useMutation<{ success: boolean }, Error, void>({
    mutationFn: authApi.refreshToken,
    onSuccess: (data: { success: boolean }) => {
      console.log("토큰 자동 갱신 성공:", data);
    },
    onError: (error: Error) => {
      console.error("토큰 갱신 실패:", error);
    },
  });
};

export const useLogout = (): UseMutationResult<void, Error, void, unknown> => {
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();

  return useMutation<void, Error, void>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Zustand store 상태 초기화
      clearUser();

      // React Query 캐시 클리어
      queryClient.clear();

      // 쿠키 삭제
      document.cookie = "accessToken=; Max-Age=0; path=/";
      document.cookie = "refreshToken=; Max-Age=0; path=/";

      console.log("로그아웃 완료");
      window.location.href = "/";
    },
    onError: (error: Error) => {
      // API 실패해도 클라이언트는 정리
      clearUser();
      queryClient.clear();

      // 쿠키 삭제 (보험용)
      document.cookie = "accessToken=; Max-Age=0; path=/";
      document.cookie = "refreshToken=; Max-Age=0; path=/";

      console.error("로그아웃 API 실패했지만 클라이언트 정리:", error);
      window.location.href = "/";
    },
  });
};
