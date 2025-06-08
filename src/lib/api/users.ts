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

function getAccessToken(): string {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const tokenCookie = cookies.find((c) => c.startsWith("accessToken="));

  if (!tokenCookie) {
    throw new Error("로그인이 필요합니다");
  }

  return tokenCookie.split("=")[1];
}

export async function getMyProfile(): Promise<UserProfile> {
  const accessToken = getAccessToken();

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "프로필 조회에 실패했습니다");
  }

  return response.json();
}

export async function updateBasicProfile(
  data: UpdateBasicProfileData
): Promise<UserProfile> {
  const accessToken = getAccessToken();

  const response = await fetch(`${API_BASE_URL}/users/me/basic`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
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
  const accessToken = getAccessToken();

  const response = await fetch(`${API_BASE_URL}/users/me/social`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
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
  const accessToken = getAccessToken();

  const response = await fetch(`${API_BASE_URL}/users/me/idname`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
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
  const accessToken = getAccessToken();

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
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
