import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  displayName: string;
  idname: string | null;
  avatarUrl: string | null;
  bio: string | null;
  status: "pending" | "active";
  emailVerified: boolean;
  // 추가 필드들 (users.ts와 통일)
  github?: string | null;
  linkedin?: string | null;
  website?: string | null;
}

interface AuthState {
  user: User | null;
  hasHydrated: boolean;

  // Actions
  login: (user: User) => void;
  clearUser: () => void; // logout → clearUser로 이름 변경
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
      hasHydrated: false,

      login: (user: User) => {
        console.log(
          "🔐 로그인:",
          user.email,
          user.status === "pending" ? "프로필 설정 필요" : "로그인 완료"
        );
        set({ user });
      },

      clearUser: () => {
        console.log("🧹 사용자 상태 초기화");
        set({ user: null });
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
      name: "stacklog",
      partialize: (state) => ({
        user: state.user,
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
