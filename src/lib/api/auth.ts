// src/lib/api/auth.ts (소셜 로그인 전용)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Google 사용자 타입
export interface GoogleUser {
  id: number;
  email: string;
  displayName: string;
  idname: string | null;
  avatarUrl: string | null;
  bio: string | null;
  status: "pending" | "active";
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleAuthResponse {
  user: GoogleUser;
  isNewUser: boolean;
  needsProfileSetup: boolean;
}

export interface GoogleProfileData {
  idname: string;
  bio?: string;
}

// Google OAuth 로그인 시작
export function startGoogleLogin() {
  console.log("🔍 Google 로그인 시작...");
  window.location.href = `${API_BASE_URL}/auth/google`;
}

// 네이버 OAuth 로그인 시작
export function startNaverLogin() {
  console.log("🟢 네이버 로그인 시작...");
  window.location.href = `${API_BASE_URL}/auth/naver`;
}

export async function completeProfile(
  profileData: GoogleProfileData
): Promise<GoogleAuthResponse> {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const tokenCookie = cookies.find((c) => c.startsWith("accessToken="));

  if (!tokenCookie) {
    throw new Error("로그인이 필요합니다");
  }

  const accessToken = tokenCookie.split("=")[1];

  const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "프로필 설정에 실패했습니다");
  }

  return response.json();
}

// 🔄 토큰 갱신
export async function refreshAccessToken(): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
  });

  if (!response.ok) {
    throw new Error("토큰 갱신에 실패했습니다");
  }

  return response.json();
}

export async function checkIdnameAvailable(idname: string): Promise<{
  idname: string;
  isAvailable: boolean;
  message: string;
}> {
  const response = await fetch(`${API_BASE_URL}/users/check-idname/${idname}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("사용자 ID 확인에 실패했습니다");
  }

  return response.json();
}

// 🚪 로그아웃
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("✅ 로그아웃 완료");
  } catch (error) {
    console.error("❌ 로그아웃 에러:", error);
  }
}
