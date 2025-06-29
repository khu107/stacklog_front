const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Post 관련 타입들
export interface Post {
  id: number;
  title: string;
  content: string;
  summary?: string;
  slug: string;
  thumbnail?: string;
  status: "draft" | "published";
  isPrivate: boolean;
  tags: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  author: {
    id: number;
    displayName: string;
    idname: string;
    avatarUrl?: string;
  };
}

// 글 생성/수정용 데이터 타입
export interface CreatePostData {
  title: string;
  content: string;
  summary?: string;
  thumbnail?: string;
  status: "draft" | "published";
  isPrivate?: boolean;
  tags?: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  summary?: string;
  thumbnail?: string;
  status?: "draft" | "published";
  isPrivate?: boolean;
  tags?: string[];
}

// 이미지 업로드 응답 타입
export interface ImageUploadResponse {
  filename: string;
  url: string;
  originalName: string;
  size: number;
}

export interface SearchParams {
  q: string;
  page?: number;
  take?: number;
}

export interface SearchResponse {
  posts: Post[];
  total: number;
  query: string;
  page?: number;
  take?: number;
  totalPages?: number;
}

// React Query용 Posts API 함수들
export const postsApi = {
  // 공개 글 목록 조회
  getPublicPosts: (): Promise<Post[]> =>
    fetch(`${API_BASE_URL}/posts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (!res.ok) throw new Error("게시글 목록을 불러올 수 없습니다");
      return res.json();
    }),

  // 글 상세 조회 (공개 + 본인 비공개)
  getPostBySlug: (slug: string): Promise<Post> =>
    fetch(`${API_BASE_URL}/posts/${slug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then((res) => {
      if (!res.ok) throw new Error("게시글을 찾을 수 없습니다");
      return res.json();
    }),

  // 내 발행된 글 전체 조회 (공개 + 비공개)
  getMyPosts: (): Promise<Post[]> =>
    fetch(`${API_BASE_URL}/posts/my-posts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then((res) => {
      if (!res.ok) throw new Error("내 게시글을 불러올 수 없습니다");
      return res.json();
    }),

  // 내 임시저장 글 조회
  getMyDrafts: (): Promise<Post[]> =>
    fetch(`${API_BASE_URL}/posts/my-drafts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then((res) => {
      if (!res.ok) throw new Error("임시저장 글을 불러올 수 없습니다");
      return res.json();
    }),

  // 글 생성
  createPost: (data: CreatePostData): Promise<Post> =>
    fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error("게시글 생성에 실패했습니다");
      return res.json();
    }),

  // 글 수정
  updatePost: (id: number, data: UpdatePostData): Promise<Post> =>
    fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error("게시글 수정에 실패했습니다");
      return res.json();
    }),

  // 글 삭제
  deletePost: (id: number): Promise<{ message: string }> =>
    fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then((res) => {
      if (!res.ok) throw new Error("게시글 삭제에 실패했습니다");
      return res.json();
    }),

  // 이미지 업로드 (임시)
  uploadImage: (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append("postImage", file);

    return fetch(`${API_BASE_URL}/posts/upload-image`, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error("이미지 업로드에 실패했습니다");
      return res.json();
    });
  },
};

export const searchApi = {
  // 포스트 검색
  searchPosts: (params: SearchParams): Promise<SearchResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append("q", params.q);

    if (params.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params.take) {
      searchParams.append("take", params.take.toString());
    }

    return fetch(`${API_BASE_URL}/posts/search?${searchParams.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (!res.ok) throw new Error("검색에 실패했습니다");
      return res.json();
    });
  },
};
