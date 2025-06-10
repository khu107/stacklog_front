const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

//모든 OAuth 제공자에 대응하는 일반적인 이름
export interface User {
  id: number;
  email: string;
  displayName: string;
  idname: string | null;
  avatarUrl: string | null;
  bio: string | null;
  status: "pending" | "active";
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  isNewUser: boolean;
  needsProfileSetup: boolean;
}

export interface ProfileData {
  idname: string;
  bio?: string;
}

// 쿠키 확인 함수
export function hasAuthCookies(): boolean {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  return cookies.some((c) => c.startsWith("accessToken="));
}

// OAuth 로그인 시작 함수들 (모든 제공자)
export function startGoogleLogin() {
  console.log("🔍 Google 로그인 시작...");
  window.location.href = `${API_BASE_URL}/auth/google`;
}

export function startNaverLogin() {
  console.log("🔍 Naver 로그인 시작...");
  window.location.href = `${API_BASE_URL}/auth/naver`;
}

export function startGithubLogin() {
  console.log("🔍 Github 로그인 시작...");
  window.location.href = `${API_BASE_URL}/auth/github`;
}

// React Query용 API 함수들
export const authApi = {
  completeProfile: (profileData: ProfileData): Promise<AuthResponse> =>
    fetch(`${API_BASE_URL}/auth/complete-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profileData),
    }).then((res) => {
      if (!res.ok) throw new Error("프로필 설정에 실패했습니다");
      return res.json();
    }),

  checkIdname: (
    idname: string
  ): Promise<{
    idname: string;
    isAvailable: boolean;
    message: string;
  }> =>
    fetch(`${API_BASE_URL}/users/check-idname/${idname}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (!res.ok) throw new Error("사용자 ID 확인에 실패했습니다");
      return res.json();
    }),

  refreshToken: (): Promise<{ success: boolean }> =>
    fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then((res) => {
      if (!res.ok) throw new Error("토큰 갱신에 실패했습니다");
      return res.json();
    }),

  logout: (): Promise<void> =>
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then((res) => {
      if (!res.ok) throw new Error("로그아웃에 실패했습니다");
      return res.json();
    }),
};
