import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAvatarUrl = (avatarUrl: string | null): string => {
  if (!avatarUrl) return "/placeholder.svg";
  if (avatarUrl.startsWith("http")) return avatarUrl;

  const baseUrl =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:3000";
  return `${baseUrl}${avatarUrl}`;
};

export const getAvatarFallback = (user: {
  displayName?: string;
  email?: string;
}): string => {
  if (user.displayName && user.displayName.trim()) {
    return user.displayName.charAt(0).toUpperCase();
  }
  if (user.email && user.email.trim()) {
    return user.email.charAt(0).toUpperCase();
  }
  return "U";
};

// 이미지 URL 처리 - null을 반환할 수 있도록 수정
export const getImageUrl = (
  imagePath: string | null | undefined
): string | null => {
  if (!imagePath) return null; // null, undefined, 빈 문자열 모두 null 반환

  // 이미 완전한 URL인 경우
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:3000";

  // 앞의 /를 제거하고 baseUrl과 합치기
  const cleanPath = imagePath.replace(/^\/+/, "");

  return `${baseUrl}/${cleanPath}`;
};

// 기본 이미지가 필요한 경우를 위한 함수
export const getImageUrlWithFallback = (
  imagePath: string | null | undefined,
  fallbackUrl: string = "/placeholder.jpg"
): string => {
  const url = getImageUrl(imagePath);
  return url || fallbackUrl;
};

// 포스트 썸네일 전용 (더 명확하게)
export const getPostThumbnailUrl = (
  thumbnailPath: string | null | undefined
): string | null => {
  return getImageUrl(thumbnailPath);
};
