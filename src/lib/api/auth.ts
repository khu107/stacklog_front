const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface User {
  id: number;
  email: string;
  profileName: string;
  userId: string;
  introduction?: string;
  isVerified: boolean;
}

export interface AuthResponse {
  message: string;
  isNewUser: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface CompleteProfileData {
  profileName: string;
  userId: string;
  introduction?: string;
}

// 매직 링크 요청 (로그인/회원가입 통합)
export async function sendMagicLink(email: string): Promise<AuthResponse> {
  // Basic 인증 토큰 생성 (이메일을 base64로 인코딩)
  const basicToken = Buffer.from(email).toString("base64");

  const response = await fetch(`${API_BASE_URL}/auth/continue`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "요청에 실패했습니다");
  }

  return response.json();
}

// 회원가입 완료 (프로필 정보 포함)
export async function completeRegistration(
  token: string,
  profileData: CompleteProfileData
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/complete-registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      profile: profileData,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "회원가입에 실패했습니다");
  }

  return response.json();
}

// 토큰 갱신
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("토큰 갱신에 실패했습니다");
  }

  return response.json();
}

// 현재 사용자 정보 조회 (JWT 토큰 기반)
export async function getCurrentUser(
  accessToken?: string
): Promise<User | null> {
  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

// 로그아웃 (토큰 무효화)
export async function logout(accessToken?: string): Promise<void> {
  if (!accessToken) return;

  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
}
