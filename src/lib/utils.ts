import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAvatarUrl = (avatarUrl: string | null): string => {
  if (!avatarUrl) return "/placeholder.svg";
  if (avatarUrl.startsWith("http")) return avatarUrl;
  return `http://localhost:3000${avatarUrl}`;
};

export const getAvatarFallback = (user: {
  displayName?: string;
  email?: string;
}): string => {
  // 우선순위: displayName > email
  if (user.displayName && user.displayName.trim()) {
    return user.displayName.charAt(0).toUpperCase();
  }
  if (user.email && user.email.trim()) {
    return user.email.charAt(0).toUpperCase();
  }
  return "U";
};
