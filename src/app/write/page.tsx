"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, X } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorSelection } from "@codemirror/state";
import MarkdownToolbar from "@/components/write/MarkdownToolbar";
import MarkdownPreview from "@/components/write/MarkdownPreview";
import PublishModal, { PublishData } from "@/components/write/PublishModal";
import { useCreatePost } from "@/hooks/usePosts";
import { useAuthStore } from "@/stores/auth-store";
import {
  writePageExtensions,
  commonBasicSetup,
} from "@/lib/codemirror-extensions";

export default function WritePage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated, user } = useAuthStore();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const editorRef = useRef<any>(null);

  // 인증 체크
  useEffect(() => {
    if (hasHydrated && !isAuthenticated()) {
      router.replace("/");
      return;
    }
  }, [hasHydrated, isAuthenticated, router]);

  //  React Query 훅 사용
  const {
    mutate: createPost,
    isPending: isCreating,
    error: createError,
  } = useCreatePost();

  // 인증되지 않은 사용자 또는 user 정보 로딩 중
  if (!hasHydrated || !isAuthenticated() || !user || !user.idname) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!hasHydrated
              ? "초기화 중..."
              : !isAuthenticated()
              ? "로그인 확인 중..."
              : !user
              ? "사용자 정보 로딩 중..."
              : "사용자 정보 확인 중..."}
          </p>
        </div>
      </div>
    );
  }

  // 태그 처리
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && value === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  // 툴바에서 마크다운 삽입
  const handleInsert = useCallback((markdownText: string) => {
    if (!editorRef.current?.view) return;

    const view = editorRef.current.view;
    const { state } = view;
    const { selection } = state;
    const { main } = selection;

    const transaction = state.update({
      changes: {
        from: main.from,
        to: main.to,
        insert: markdownText,
      },
      selection: EditorSelection.cursor(main.from + markdownText.length),
    });

    view.dispatch(transaction);
    view.focus();
  }, []);

  //  임시저장 - React Query 사용
  const handleSaveDraft = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    createPost(
      {
        title: title.trim(),
        content,
        tags,
        status: "draft",
      },
      {
        onSuccess: (data) => {
          alert("임시저장되었습니다!");
          console.log("임시저장 성공:", data);
        },
        onError: (error) => {
          alert("임시저장에 실패했습니다.");
          console.error("임시저장 실패:", error);
        },
      }
    );
  };

  // 출간하기 (모달 열기)
  const handlePublishClick = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setIsPublishModalOpen(true);
  };

  // 실제 출간 처리 - React Query 사용
  const handlePublish = (publishData: PublishData) => {
    createPost(
      {
        title: title.trim(),
        content,
        tags,
        summary: publishData.summary || undefined,
        thumbnail: publishData.thumbnail || undefined,
        isPrivate: publishData.isPrivate,
        status: "published",
      },
      {
        onSuccess: (data) => {
          alert("글이 출간되었습니다!");
          // 모달 닫기
          setIsPublishModalOpen(false);

          // 잠시 후 이동 (React 상태 업데이트 완료 대기)
          setTimeout(() => {
            if (user.idname) {
              const targetUrl = `/@${user.idname}/${data.slug}`;
              router.push(targetUrl);
            } else {
              router.push("/");
            }
          }, 100);
        },
        onError: (error) => {
          alert("출간에 실패했습니다.");
          setIsPublishModalOpen(false);
        },
      }
    );
  };

  // 나가기 버튼
  const handleExit = () => {
    // 작성 중인 내용이 있으면 확인
    if (title.trim() || content.trim()) {
      const confirmed = confirm(
        "작성 중인 내용이 있습니다. 정말 나가시겠습니까?"
      );
      if (!confirmed) return;
    }

    router.back(); // 또는 router.push('/')
  };

  return (
    <>
      <div className="min-h-screen bg-white flex">
        {/* 왼쪽: 편집 영역 */}
        <div className="flex-1 flex flex-col border-r border-gray-200">
          {/* 제목과 태그 영역 */}
          <div className="border-gray-200 bg-white">
            <div className="pt-8 px-12">
              {/* 제목 입력 */}
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isCreating}
                  className="bg-transparent block p-0 w-full font-bold border-none shadow-none outline-none placeholder:text-gray-400 focus-visible:ring-0 focus:border-none focus:outline-none disabled:opacity-50"
                  style={{
                    fontSize: "2.3rem",
                    lineHeight: "1.5",
                    resize: "none",
                    color: "var(--text1)",
                  }}
                />
              </div>

              {/* 태그 입력 및 표시 영역 */}
              <div className="mb-4">
                {/* 기존 태그들 표시 */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() =>
                            setTags(tags.filter((_, i) => i !== index))
                          }
                          disabled={isCreating}
                          className="hover:bg-blue-200 rounded-full p-0.5 disabled:opacity-50"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* 태그 입력 필드 */}
                <Input
                  type="text"
                  placeholder="태그를 입력하세요 (엔터, 콤마로 구분)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  disabled={isCreating}
                  className="bg-transparent inline-flex outline-none cursor-text border-none shadow-none px-0 placeholder:text-gray-400 focus-visible:ring-0 focus:border-none focus:outline-none disabled:opacity-50"
                  style={{
                    fontSize: "1.125rem",
                    lineHeight: "2rem",
                    marginBottom: "0.75rem",
                    minWidth: "8rem",
                    color: "var(--text1)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* 에디터 툴바 */}
          <div className="px-12 mb-4">
            <MarkdownToolbar onInsert={handleInsert} />
          </div>

          {/* 에디터 */}
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              ref={editorRef}
              value={content}
              onChange={setContent}
              extensions={writePageExtensions}
              placeholder="당신의 이야기를 적어보세요..."
              height="100%"
              editable={!isCreating}
              basicSetup={commonBasicSetup}
            />
          </div>

          {/* 하단 버튼 영역 */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleExit}
                disabled={isCreating}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <ArrowLeft size={20} />
                <span>나가기</span>
              </button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isCreating}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  {isCreating ? "저장 중..." : "임시저장"}
                </Button>
                <Button
                  onClick={handlePublishClick}
                  disabled={isCreating}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  출간하기
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 미리보기 영역 */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col bg-white">
          <div className="flex-1 overflow-y-auto">
            <MarkdownPreview content={content} />
          </div>
        </div>
      </div>

      {/* 출간 설정 모달 */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => !isCreating && setIsPublishModalOpen(false)}
        onPublish={handlePublish}
        isLoading={isCreating}
      />
    </>
  );
}
