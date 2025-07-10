import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAvatarUrl = (avatarUrl: string | null): string => {
  if (!avatarUrl) return "";
  if (avatarUrl.startsWith("http")) return avatarUrl;

  const baseUrl =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:3000";
  return `${baseUrl}${avatarUrl}`;
};

// 이미지 URL 처리 - null을 반환할 수 있도록
export const getImageUrl = (
  imagePath: string | null | undefined
): string | null => {
  if (!imagePath) return null;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:3000";

  const cleanPath = imagePath.replace(/^\/+/, "");

  // URL 인코딩 추가
  const encodedPath = encodeURI(cleanPath);

  return `${baseUrl}/${encodedPath}`;
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
