// src/stores/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  profileName: string;
  userId: string;
  introduction?: string;
  isVerified: boolean;
}

interface AuthState {
  // 상태
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  // 액션
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  updateUser: (user: Partial<User>) => void;

  // 토큰 관련 헬퍼
  isAuthenticated: () => boolean;
  getAccessToken: () => string | null;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      // 로그인
      login: (user: User, accessToken: string, refreshToken: string) => {
        console.log("🔐 Zustand 로그인:", user.email);
        set({
          user,
          accessToken,
          refreshToken,
          isLoading: false,
        });
      },

      // 로그아웃
      logout: () => {
        console.log("🚪 Zustand 로그아웃");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
        });
      },

      // 로딩 상태
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // 토큰 업데이트 (토큰 갱신 시 사용)
      setTokens: (accessToken: string, refreshToken?: string) => {
        const currentState = get();
        set({
          accessToken,
          refreshToken: refreshToken || currentState.refreshToken,
        });
      },

      // 사용자 정보 업데이트
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      // 인증 여부 확인
      isAuthenticated: () => {
        const state = get();
        return !!(state.user && state.accessToken);
      },

      // 액세스 토큰 조회
      getAccessToken: () => {
        return get().accessToken;
      },

      // 모든 인증 정보 삭제
      clearAuth: () => {
        console.log("🗑️ 인증 정보 완전 삭제");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
        });
      },
    }),
    {
      name: "dev-kundalik-auth", // localStorage 키
      // 토큰과 사용자 정보만 저장, isLoading은 제외
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      // 저장/복원 시 로그
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
        };
      },
    }
  )
);
