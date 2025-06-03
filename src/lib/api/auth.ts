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

// 🚀 Google OAuth 로그인 시작
export function startGoogleLogin() {
  console.log("🔍 Google 로그인 시작...");
  window.location.href = `${API_BASE_URL}/auth/google`;
}

// // 📝 Google 프로필 설정 완료
// export async function completeGoogleProfile(
//   profileData: GoogleProfileData
// ): Promise<GoogleAuthResponse> {
//   const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include", // 쿠키에서 accessToken 자동 포함
//     body: JSON.stringify(profileData),
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || "프로필 설정에 실패했습니다");
//   }

//   return response.json();
// }

// lib/api/auth.ts - completeGoogleProfile 함수 수정
export async function completeGoogleProfile(
  profileData: GoogleProfileData
): Promise<GoogleAuthResponse> {
  // 🔧 쿠키에서 accessToken 추출
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
      Authorization: `Bearer ${accessToken}`, // 🔧 Authorization 헤더 추가
    },
    credentials: "include", // 쿠키도 포함
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
