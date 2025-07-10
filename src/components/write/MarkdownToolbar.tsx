// "use client";

// import {
//   Bold,
//   Italic,
//   Strikethrough,
//   Quote,
//   Link,
//   Image,
//   Code,
// } from "lucide-react";

// interface MarkdownToolbarProps {
//   onInsert: (markdown: string) => void;
// }

// export default function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
//   const handleHeading = (level: number) => {
//     const heading = "#".repeat(level) + " ";
//     onInsert(heading);
//   };

//   const handleBold = () => {
//     onInsert("**텍스트**");
//   };

//   const handleItalic = () => {
//     onInsert("*텍스트*");
//   };

//   const handleStrikethrough = () => {
//     onInsert("~~텍스트~~");
//   };

//   const handleQuote = () => {
//     onInsert("> ");
//   };

//   const handleLink = () => {
//     onInsert("[링크텍스트](URL)");
//   };

//   const handleImage = () => {
//     onInsert("![이미지설명](이미지URL)");
//   };

//   const handleCode = () => {
//     onInsert("```\n코드\n```");
//   };

//   return (
//     <div className="flex items-center gap-4 p-2 ">
//       {/* ✅ 헤딩 버튼들 - 새로운 스타일 적용 */}
//       <div className="flex gap-1">
//         {[1, 2, 3, 4].map((level) => (
//           <button
//             key={level}
//             onClick={() => handleHeading(level)}
//             className="flex items-center justify-center cursor-pointer flex-shrink-0 bg-transparent outline-none border-none p-0 hover:bg-gray-200 rounded"
//             style={{
//               width: "3rem",
//               height: "3rem",
//               color: "var(--text3)",
//             }}
//           >
//             H{level}
//           </button>
//         ))}
//       </div>

//       {/* 구분선 */}
//       <div className="w-px h-6 bg-gray-300 mx-2" />

//       {/* 텍스트 스타일 버튼들 */}
//       <div className="flex gap-1">
//         <button
//           onClick={handleBold}
//           className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
//           title="굵게"
//         >
//           <Bold size={16} />
//         </button>

//         <button
//           onClick={handleItalic}
//           className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
//           title="기울임"
//         >
//           <Italic size={16} />
//         </button>

//         <button
//           onClick={handleStrikethrough}
//           className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
//           title="취소선"
//         >
//           <Strikethrough size={16} />
//         </button>
//       </div>

//       {/* 구분선 */}
//       <div className="w-px h-6 bg-gray-300 mx-2" />

//       {/* 기타 버튼들 */}
//       <div className="flex gap-1">
//         <button
//           onClick={handleQuote}
//           className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
//           title="인용"
//         >
//           <Quote size={16} />
//         </button>

//         <button
//           onClick={handleLink}
//           className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
//           title="링크"
//         >
//           <Link size={16} />
//         </button>

//         <button
//           onClick={handleImage}
//           className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
//           title="이미지"
//         >
//           <Image size={16} />
//         </button>

//         <button
//           onClick={handleCode}
//           className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
//           title="코드블록"
//         >
//           <Code size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Quote,
  Link,
  Image,
  Code,
  Upload,
} from "lucide-react";
import { useUploadImage } from "@/hooks/usePosts";

interface MarkdownToolbarProps {
  onInsert: (markdown: string) => void;
}

export default function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 이미지 업로드 훅
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();

  const handleHeading = (level: number) => {
    const heading = "#".repeat(level) + " ";
    onInsert(heading);
  };

  const handleBold = () => {
    onInsert("**텍스트**");
  };

  const handleItalic = () => {
    onInsert("*텍스트*");
  };

  const handleStrikethrough = () => {
    onInsert("~~텍스트~~");
  };

  const handleQuote = () => {
    onInsert("> ");
  };

  const handleLink = () => {
    onInsert("[링크텍스트](URL)");
  };

  const handleCode = () => {
    onInsert("```\n코드\n```");
  };

  // 🔥 이미지 업로드 처리
  const handleImageUpload = (file: File) => {
    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    uploadImage(file, {
      onSuccess: (data) => {
        console.log("✅ 툴바 이미지 업로드 성공:", data);

        // 🔥 full URL 생성
        const fullUrl = data.url.startsWith("http")
          ? data.url
          : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${
              data.url
            }`;

        // 업로드 완료 후 마크다운 삽입
        const imageMarkdown = `![${
          data.originalName || file.name
        }](${fullUrl})`;
        onInsert(`\n${imageMarkdown}\n`);

        alert("이미지가 업로드되었습니다!");
      },
      onError: (error) => {
        console.error("❌ 툴바 이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다.");
      },
    });
  };

  // 이미지 버튼 클릭 처리
  const handleImageClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  // 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 p-2">
        {/* ✅ 헤딩 버튼들 */}
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <button
              key={level}
              onClick={() => handleHeading(level)}
              disabled={isUploading}
              className="flex items-center justify-center cursor-pointer flex-shrink-0 bg-transparent outline-none border-none p-0 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                width: "3rem",
                height: "3rem",
                color: "var(--text3)",
              }}
            >
              H{level}
            </button>
          ))}
        </div>

        {/* 구분선 */}
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* 텍스트 스타일 버튼들 */}
        <div className="flex gap-1">
          <button
            onClick={handleBold}
            disabled={isUploading}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="굵게"
          >
            <Bold size={16} />
          </button>

          <button
            onClick={handleItalic}
            disabled={isUploading}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="기울임"
          >
            <Italic size={16} />
          </button>

          <button
            onClick={handleStrikethrough}
            disabled={isUploading}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="취소선"
          >
            <Strikethrough size={16} />
          </button>
        </div>

        {/* 구분선 */}
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* 기타 버튼들 */}
        <div className="flex gap-1">
          <button
            onClick={handleQuote}
            disabled={isUploading}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="인용"
          >
            <Quote size={16} />
          </button>

          <button
            onClick={handleLink}
            disabled={isUploading}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="링크"
          >
            <Link size={16} />
          </button>

          {/* 🔥 이미지 업로드 버튼 */}
          <button
            onClick={handleImageClick}
            disabled={isUploading}
            className={`p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isUploading ? "animate-pulse" : ""
            }`}
            title={isUploading ? "이미지 업로드 중..." : "이미지 업로드"}
          >
            {isUploading ? (
              <Upload size={16} className="animate-spin" />
            ) : (
              <Image size={16} />
            )}
          </button>

          <button
            onClick={handleCode}
            disabled={isUploading}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="코드블록"
          >
            <Code size={16} />
          </button>
        </div>

        {/* 업로드 상태 표시 */}
        {isUploading && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            <Upload size={14} className="animate-spin" />
            <span>이미지 업로드 중...</span>
          </div>
        )}
      </div>

      {/* 🔥 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </>
  );
}
