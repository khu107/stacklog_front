const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// 타입들은 그대로 유지
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

export interface UpdateBasicProfileData {
  displayName?: string;
  bio?: string;
}

export interface UpdateSocialProfileData {
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface UpdateIdnameData {
  idname: string;
}

// 쿠키 확인 함수 (유틸 함수라 그대로 유지)
export function hasAuthCookies(): boolean {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  return cookies.some((c) => c.startsWith("accessToken="));
}

// 🔥 React Query용 API 함수들
export const userApi = {
  // 현재 사용자 정보 가져오기
  getCurrentUser: (): Promise<UserProfile> =>
    fetch(`${API_BASE_URL}/users/me`, {
      credentials: "include",
    }).then((res) => {
      if (!res.ok) throw new Error("사용자 정보를 가져올 수 없습니다");
      return res.json();
    }),

  // 아바타 업로드
  uploadAvatar: (
    file: File
  ): Promise<{ message: string; avatarUrl: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);

    return fetch(`${API_BASE_URL}/users/me/avatar`, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error("아바타 업로드에 실패했습니다");
      return res.json();
    });
  },

  // 아바타 삭제
  deleteAvatar: (): Promise<UserProfile> =>
    fetch(`${API_BASE_URL}/users/me/avatar`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (!res.ok) throw new Error("아바타 삭제에 실패했습니다");
      return res.json();
    }),

  // 기본 프로필 수정
  updateBasicProfile: (data: UpdateBasicProfileData): Promise<UserProfile> =>
    fetch(`${API_BASE_URL}/users/me/basic`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error("기본 정보 수정에 실패했습니다");
      return res.json();
    }),

  // 소셜 프로필 수정
  updateSocialProfile: (data: UpdateSocialProfileData): Promise<UserProfile> =>
    fetch(`${API_BASE_URL}/users/me/social`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error("소셜 링크 수정에 실패했습니다");
      return res.json();
    }),

  // ID명 변경
  updateIdname: (data: UpdateIdnameData): Promise<UserProfile> =>
    fetch(`${API_BASE_URL}/users/me/idname`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error("ID 변경에 실패했습니다");
      return res.json();
    }),

  // 계정 삭제
  deleteAccount: (): Promise<{ message: string }> =>
    fetch(`${API_BASE_URL}/users/me`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then((res) => {
      if (!res.ok) throw new Error("계정 삭제에 실패했습니다");

      // 클라이언트 스토리지 정리
      localStorage.clear();
      sessionStorage.clear();
      console.log("✅ 클라이언트 스토리지 정리 완료");

      return res.json();
    }),
};

// 🔄 기존 함수명 호환성을 위한 별칭들 (필요시)
export const getCurrentUser = userApi.getCurrentUser;
export const getMyProfile = userApi.getCurrentUser;
