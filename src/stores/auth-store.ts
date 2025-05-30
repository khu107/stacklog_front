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
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;

  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  updateUser: (user: Partial<User>) => void;

  isAuthenticated: () => boolean;
  getAccessToken: () => string | null;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,

      login: (user: User, accessToken: string) => {
        console.log("🔐 Zustand 로그인:", user.email);
        set({
          user,
          accessToken,
          isLoading: false,
        });
      },

      // 로그아웃
      logout: () => {
        console.log("🚪 Zustand 로그아웃");
        set({
          user: null,
          accessToken: null,
          isLoading: false,
        });
      },

      // 로딩 상태
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // 액세스 토큰만 업데이트 (토큰 갱신 시 사용)
      setAccessToken: (accessToken: string) => {
        console.log("🔄 액세스 토큰 업데이트");
        set({ accessToken });
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
          isLoading: false,
        });
      },
    }),
    {
      name: "dev-kundalik-auth", // localStorage 키
      // accessToken과 사용자 정보만 저장 (refreshToken 제외)
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
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
