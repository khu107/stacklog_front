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

// 🆕 회원가입 완료 (인증 코드 방식)
export async function completeRegistration(
  code: string, // 🔄 token → code로 변경
  profileData: CompleteProfileData
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/complete-registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함 (refreshToken 받기 위해)
    body: JSON.stringify({
      code, // 🔄 token → code로 변경
      profile: profileData,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "회원가입에 실패했습니다");
  }

  return response.json();
}

// 🆕 로그인 성공 후 사용자 정보 조회 (새로운 함수)
export async function getCurrentUserInfo(): Promise<{
  accessToken: string;
  user: User;
}> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키에서 refreshToken 읽기
  });

  if (!response.ok) {
    throw new Error("사용자 정보를 가져올 수 없습니다");
  }

  return response.json();
}

// 토큰 갱신 - 쿠키에서 refreshToken 자동으로 읽음
export async function refreshAccessToken(): Promise<{ accessToken: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키에서 refreshToken 읽기
  });

  if (!response.ok) {
    throw new Error("토큰 갱신에 실패했습니다");
  }

  return response.json();
}

// 🗑️ 사용 안함: getCurrentUser 함수 (JWT 디코딩 방식)
// export async function getCurrentUser(accessToken?: string) { ... }

// 로그아웃 - refreshToken 쿠키 삭제
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키 포함 (refreshToken 삭제하기 위해)
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
}
