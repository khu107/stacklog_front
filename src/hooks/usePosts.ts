import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  postsApi,
  type Post,
  type CreatePostData,
  type UpdatePostData,
  type ImageUploadResponse,
  SearchParams,
  SearchResponse,
  searchApi,
} from "@/lib/api/posts";
import { useDebounce } from "./useDebounce";

// 🔍 공개 글 목록 조회
export const usePublicPosts = (): UseQueryResult<Post[], Error> => {
  return useQuery<Post[], Error>({
    queryKey: ["publicPosts"],
    queryFn: postsApi.getPublicPosts,
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
  });
};

// 🔍 글 상세 조회 (slug로)
export const usePostBySlug = (
  slug: string,
  enabled: boolean = true
): UseQueryResult<Post, Error> => {
  return useQuery<Post, Error>({
    queryKey: ["post", slug],
    queryFn: () => postsApi.getPostBySlug(slug),
    enabled: !!slug && enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// 🔍 내 발행된 글 전체 조회
export const useMyPosts = (): UseQueryResult<Post[], Error> => {
  return useQuery<Post[], Error>({
    queryKey: ["myPosts"],
    queryFn: postsApi.getMyPosts,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// 🔍 내 임시저장 글 조회
export const useMyDrafts = (): UseQueryResult<Post[], Error> => {
  return useQuery<Post[], Error>({
    queryKey: ["myDrafts"],
    queryFn: postsApi.getMyDrafts,
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// ✏️ 글 생성
export const useCreatePost = (): UseMutationResult<
  Post,
  Error,
  CreatePostData,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, CreatePostData>({
    mutationFn: postsApi.createPost,
    onSuccess: (newPost: Post) => {
      // 성공 시 관련 캐시들 업데이트
      console.log("서버 응답 데이터:", newPost);
      // 1. 공개 글이면 공개 목록에 추가
      if (newPost.status === "published" && !newPost.isPrivate) {
        queryClient.setQueryData<Post[]>(["publicPosts"], (oldData) => {
          if (oldData) {
            return [newPost, ...oldData];
          }
          return [newPost];
        });
      }

      // 2. 발행된 글이면 내 글 목록에 추가
      if (newPost.status === "published") {
        queryClient.setQueryData<Post[]>(["myPosts"], (oldData) => {
          if (oldData) {
            return [newPost, ...oldData];
          }
          return [newPost];
        });
      }

      // 3. 임시저장이면 임시저장 목록에 추가
      if (newPost.status === "draft") {
        queryClient.setQueryData<Post[]>(["myDrafts"], (oldData) => {
          if (oldData) {
            return [newPost, ...oldData];
          }
          return [newPost];
        });
      }

      // 4. 개별 글 캐시 설정
      queryClient.setQueryData(["post", newPost.slug], newPost);

      console.log("글 생성 성공:", newPost.title);
    },
    onError: (error: Error) => {
      console.error("글 생성 실패:", error);
    },
  });
};

// 글 수정
export const useUpdatePost = (): UseMutationResult<
  Post,
  Error,
  { id: number; data: UpdatePostData },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, { id: number; data: UpdatePostData }>({
    mutationFn: ({ id, data }) => postsApi.updatePost(id, data),
    onSuccess: (updatedPost: Post) => {
      // 수정된 글 캐시 업데이트

      // 1. 개별 글 캐시 업데이트
      queryClient.setQueryData(["post", updatedPost.slug], updatedPost);

      // 2. 목록들에서 해당 글 업데이트
      ["publicPosts", "myPosts", "myDrafts"].forEach((queryKey) => {
        queryClient.setQueryData<Post[]>([queryKey], (oldData) => {
          if (oldData) {
            return oldData.map((post) =>
              post.id === updatedPost.id ? updatedPost : post
            );
          }
          return oldData;
        });
      });

      console.log("글 수정 성공:", updatedPost.title);
    },
    onError: (error: Error) => {
      console.error("글 수정 실패:", error);
    },
  });
};

// 🗑️ 글 삭제
export const useDeletePost = (): UseMutationResult<
  { message: string },
  Error,
  number,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, number>({
    mutationFn: postsApi.deletePost,
    onSuccess: (data, deletedPostId) => {
      // 삭제된 글을 모든 캐시에서 제거

      ["publicPosts", "myPosts", "myDrafts"].forEach((queryKey) => {
        queryClient.setQueryData<Post[]>([queryKey], (oldData) => {
          if (oldData) {
            return oldData.filter((post) => post.id !== deletedPostId);
          }
          return oldData;
        });
      });

      // 개별 글 캐시도 무효화 (slug를 모르므로)
      queryClient.invalidateQueries({ queryKey: ["post"] });

      console.log("글 삭제 성공:", data.message);
    },
    onError: (error: Error) => {
      console.error("글 삭제 실패:", error);
    },
  });
};

// 📷 포스트 이미지 업로드 (콘텐츠 내 이미지용)
export const useUploadImage = (): UseMutationResult<
  ImageUploadResponse,
  Error,
  File,
  unknown
> => {
  return useMutation<ImageUploadResponse, Error, File>({
    mutationFn: postsApi.uploadImage,
    onSuccess: (data: ImageUploadResponse) => {
      console.log("이미지 업로드 성공:", data.url);
    },
    onError: (error: Error) => {
      console.error("이미지 업로드 실패:", error);
    },
  });
};

// 🖼️ 썸네일 이미지 업로드 (썸네일 전용)
export const useUploadThumbnail = (): UseMutationResult<
  ImageUploadResponse,
  Error,
  File,
  unknown
> => {
  return useMutation<ImageUploadResponse, Error, File>({
    mutationFn: postsApi.uploadThumbnail,
    onSuccess: (data: ImageUploadResponse) => {
      console.log("썸네일 업로드 성공:", data.url, "타입:", data.type);
    },
    onError: (error: Error) => {
      console.error("썸네일 업로드 실패:", error);
    },
  });
};

export const useSearchPosts = (
  query: string,
  delay: number = 500
): UseQueryResult<SearchResponse, Error> => {
  const debouncedQuery = useDebounce(query, delay);

  return useQuery<SearchResponse, Error>({
    queryKey: ["searchPosts", { q: debouncedQuery, page: 1, take: 20 }],
    queryFn: () =>
      searchApi.searchPosts({
        q: debouncedQuery,
        page: 1,
        take: 20,
      }),
    enabled: !!debouncedQuery && debouncedQuery.trim() !== "",
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// 유틸리티 훅: 캐시 새로고침
export const useRefreshPosts = () => {
  const queryClient = useQueryClient();

  return {
    refreshPublicPosts: () =>
      queryClient.invalidateQueries({ queryKey: ["publicPosts"] }),
    refreshMyPosts: () =>
      queryClient.invalidateQueries({ queryKey: ["myPosts"] }),
    refreshMyDrafts: () =>
      queryClient.invalidateQueries({ queryKey: ["myDrafts"] }),
    refreshPost: (slug: string) =>
      queryClient.invalidateQueries({ queryKey: ["post", slug] }),
  };
};
