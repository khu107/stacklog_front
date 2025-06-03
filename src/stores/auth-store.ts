// src/stores/auth-store.ts (쿠키 기반으로 수정)
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Google 사용자 타입 (백엔드와 일치)
interface User {
  id: number;
  email: string;
  displayName: string;
  profileName?: string;
  idname: string | null;
  avatarUrl: string | null;
  bio: string | null;
  status: "pending" | "active"; // 백엔드 enum과 일치
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  hasHydrated: boolean;

  // Actions
  login: (user: User) => void; // 토큰은 쿠키로 관리하므로 제거
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: User) => void;
  setHasHydrated: (hasHydrated: boolean) => void;

  // Getters
  isAuthenticated: () => boolean;
  needsProfileSetup: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      hasHydrated: false,

      login: (user: User) => {
        console.log(
          "🔐 Google 로그인:",
          user.email,
          user.status === "pending" ? "프로필 설정 필요" : "로그인 완료"
        );
        set({
          user,
          isLoading: false,
        });
      },

      logout: async () => {
        console.log("🚪 로그아웃");

        // 로그아웃 API 호출 (쿠키 삭제)
        try {
          await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
            }/auth/logout`,
            {
              method: "POST",
              credentials: "include",
            }
          );
        } catch (error) {
          console.error("로그아웃 API 오류:", error);
        }

        // 클라이언트 상태 초기화
        set({
          user: null,
          isLoading: false,
        });

        // 수동으로 쿠키 삭제 (보험용)
        document.cookie = "accessToken=; Max-Age=0; path=/";
        document.cookie = "refreshToken=; Max-Age=0; path=/";
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      updateUser: (user: User) => {
        console.log("👤 사용자 정보 업데이트:", user.displayName);
        set({ user });
      },

      setHasHydrated: (hasHydrated: boolean) => {
        set({ hasHydrated });
      },

      isAuthenticated: () => {
        const state = get();
        return !!state.user;
      },

      needsProfileSetup: () => {
        const state = get();
        return state.user ? state.user.status === "pending" : false;
      },
    }),
    {
      name: "dev-kundalik-auth",
      partialize: (state) => ({
        user: state.user, // 사용자 정보만 저장, 토큰은 쿠키에서 관리
      }),
      onRehydrateStorage: () => {
        console.log("🔄 인증 상태 복원 시작...");
        return (state, error) => {
          if (error) {
            console.error("❌ 인증 상태 복원 실패:", error);
          } else {
            console.log(
              "✅ 인증 상태 복원 완료:",
              state?.user?.email || "로그인 안됨"
            );
          }
          state?.setHasHydrated(true);
        };
      },
    }
  )
);

// 하이드레이션 훅 (SSR 이슈 해결용)
export const useAuthStoreHydrated = () => {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setHasHydrated = useAuthStore((state) => state.setHasHydrated);

  return { hasHydrated, setHasHydrated };
};
