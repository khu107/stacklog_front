const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// 사용자 프로필 타입
export interface UserProfile {
  id: number;
  email: string;
  displayName: string;
  idname: string;
  avatarUrl: string | null;
  bio: string | null;
  status: "pending" | "active";
  github: string | null;
  linkedin: string | null;
  website: string | null;
  emailVerified: boolean;
}

// 기본 정보 수정 DTO
export interface UpdateBasicProfileData {
  displayName?: string;
  bio?: string;
}

// 소셜 링크 수정 DTO
export interface UpdateSocialProfileData {
  github?: string;
  linkedin?: string;
  website?: string;
}

// ID 변경 DTO
export interface UpdateIdnameData {
  idname: string;
}

// ✅ 쿠키 확인 함수 추가
export function hasAuthCookies(): boolean {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  return cookies.some((c) => c.startsWith("accessToken="));
}

// ✅ 현재 사용자 정보 가져오기 (JWT 디코딩 대신 API 호출)
export async function getCurrentUser(): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    credentials: "include", // 쿠키만 사용
  });

  if (!response.ok) {
    throw new Error("사용자 정보를 가져올 수 없습니다");
  }

  return response.json();
}

// ✅ 기존 함수명 유지하면서 내부만 수정
export async function getMyProfile(): Promise<UserProfile> {
  return getCurrentUser(); // 위 함수 재사용
}

export async function updateBasicProfile(
  data: UpdateBasicProfileData
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/me/basic`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      // Authorization 헤더 제거
    },
    credentials: "include", // 쿠키만 사용
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "기본 정보 수정에 실패했습니다");
  }

  return response.json();
}

export async function updateSocialProfile(
  data: UpdateSocialProfileData
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/me/social`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      // Authorization 헤더 제거
    },
    credentials: "include", // 쿠키만 사용
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "소셜 링크 수정에 실패했습니다");
  }

  return response.json();
}

export async function updateIdname(
  data: UpdateIdnameData
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/me/idname`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      // Authorization 헤더 제거
    },
    credentials: "include", // 쿠키만 사용
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "ID 변경에 실패했습니다");
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

export async function deleteAccount(): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // Authorization 헤더 제거
    },
    credentials: "include", // 쿠키만 사용
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "계정 삭제에 실패했습니다");
  }

  // 🧹 클라이언트 측 스토리지 정리
  localStorage.clear();
  sessionStorage.clear();

  console.log("✅ 클라이언트 스토리지 정리 완료");

  return response.json();
}
