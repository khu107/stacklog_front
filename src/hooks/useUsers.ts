import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  userApi,
  type UserProfile,
  type UpdateBasicProfileData,
  type UpdateSocialProfileData,
  type UpdateIdnameData,
} from "@/lib/api/users";
import { useAuthStore } from "@/stores/auth-store";
import { authApi } from "@/lib/api/auth";
import { useDebounce } from "./useDebounce";

// 현재 사용자 정보 조회 - 명시적 타입 지정
export const useCurrentUser = (): UseQueryResult<UserProfile, Error> => {
  const { hasHydrated, isAuthenticated } = useAuthStore();

  return useQuery<UserProfile, Error>({
    queryKey: ["currentUser"],
    queryFn: userApi.getCurrentUser,
    enabled: hasHydrated && isAuthenticated(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    initialData: undefined,
    refetchOnWindowFocus: false,
  });
};

// 아바타 업로드 - 타입 명시
export const useUploadAvatar = (): UseMutationResult<
  { message: string; avatarUrl: string },
  Error,
  File,
  unknown
> => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation<{ message: string; avatarUrl: string }, Error, File>({
    mutationFn: userApi.uploadAvatar,
    onSuccess: (data: { message: string; avatarUrl: string }) => {
      // React Query 캐시와 Zustand store 모두 업데이트
      queryClient.setQueryData<UserProfile>(["currentUser"], (oldData) => {
        if (oldData) {
          const updatedUser: UserProfile = {
            ...oldData,
            avatarUrl: data.avatarUrl,
          };
          updateUser(updatedUser);
          return updatedUser;
        }
        return oldData;
      });

      console.log("아바타 업로드 성공:", data.avatarUrl);
    },
    onError: (error: Error) => {
      console.error(" 아바타 업로드 실패:", error);
    },
  });
};

// 아바타 삭제 - 타입 명시
export const useDeleteAvatar = (): UseMutationResult<
  UserProfile,
  Error,
  void,
  unknown
> => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation<UserProfile, Error, void>({
    mutationFn: userApi.deleteAvatar,
    onSuccess: (updatedUser: UserProfile) => {
      // React Query 캐시 갱신
      queryClient.setQueryData<UserProfile>(["currentUser"], updatedUser);

      // Zustand store 업데이트
      updateUser(updatedUser);

      console.log("✅ 아바타 삭제 성공");
    },
    onError: (error: Error) => {
      console.error("아바타 삭제 실패:", error);
    },
  });
};

// 기본 프로필 수정 - 타입 명시
export const useUpdateBasicProfile = (): UseMutationResult<
  UserProfile,
  Error,
  UpdateBasicProfileData,
  unknown
> => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation<UserProfile, Error, UpdateBasicProfileData>({
    mutationFn: userApi.updateBasicProfile,
    onSuccess: (updatedUser: UserProfile) => {
      queryClient.setQueryData<UserProfile>(["currentUser"], updatedUser);
      updateUser(updatedUser);
      console.log("기본 정보 수정 성공");
    },
    onError: (error: Error) => {
      console.error("기본 정보 수정 실패:", error);
    },
  });
};

// 소셜 프로필 수정 - 타입 명시
export const useUpdateSocialProfile = (): UseMutationResult<
  UserProfile,
  Error,
  UpdateSocialProfileData,
  unknown
> => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation<UserProfile, Error, UpdateSocialProfileData>({
    mutationFn: userApi.updateSocialProfile,
    onSuccess: (updatedUser: UserProfile) => {
      queryClient.setQueryData<UserProfile>(["currentUser"], updatedUser);
      updateUser(updatedUser);
      console.log("소셜 링크 수정 성공");
    },
    onError: (error: Error) => {
      console.error("소셜 링크 수정 실패:", error);
    },
  });
};

// ID명 변경 - 타입 명시
export const useUpdateIdname = (): UseMutationResult<
  UserProfile,
  Error,
  UpdateIdnameData,
  unknown
> => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation<UserProfile, Error, UpdateIdnameData>({
    mutationFn: userApi.updateIdname,
    onSuccess: (updatedUser: UserProfile) => {
      queryClient.setQueryData<UserProfile>(["currentUser"], updatedUser);
      updateUser(updatedUser);
      console.log("ID명 변경 성공");
    },
    onError: (error: Error) => {
      console.error("ID명 변경 실패:", error);
    },
  });
};

// ID명 중복 확인 - 타입 명시
export const useCheckIdname = (
  idname: string
): UseQueryResult<
  {
    idname: string;
    isAvailable: boolean;
    message: string;
  },
  Error
> => {
  const debouncedIdname = useDebounce(idname, 500);
  return useQuery<
    {
      idname: string;
      isAvailable: boolean;
      message: string;
    },
    Error
  >({
    queryKey: ["idname-check", debouncedIdname],
    queryFn: () => authApi.checkIdname(debouncedIdname),
    enabled: !!idname && idname.length > 0,
    staleTime: 30 * 1000,
  });
};

// 계정 삭제 - 타입 명시
export const useDeleteAccount = (): UseMutationResult<
  { message: string },
  Error,
  void,
  unknown
> => {
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();

  return useMutation<{ message: string }, Error, void>({
    mutationFn: userApi.deleteAccount,
    onSuccess: (data: { message: string }) => {
      // Zustand store 초기화
      clearUser();

      // 모든 캐시 클리어
      queryClient.clear();

      console.log("계정 삭제 완료:", data.message);
      window.location.href = "/";
    },
    onError: (error: Error) => {
      console.error(" 계정 삭제 실패:", error);
    },
  });
};
