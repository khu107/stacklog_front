"use client";

import {
  Bold,
  Italic,
  Strikethrough,
  Quote,
  Link,
  Image,
  Code,
} from "lucide-react";

interface MarkdownToolbarProps {
  onInsert: (markdown: string) => void;
}

export default function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
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

  const handleImage = () => {
    onInsert("![이미지설명](이미지URL)");
  };

  const handleCode = () => {
    onInsert("```\n코드\n```");
  };

  return (
    <div className="flex items-center gap-4 p-2 ">
      {/* ✅ 헤딩 버튼들 - 새로운 스타일 적용 */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <button
            key={level}
            onClick={() => handleHeading(level)}
            className="flex items-center justify-center cursor-pointer flex-shrink-0 bg-transparent outline-none border-none p-0 hover:bg-gray-200 rounded"
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
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="굵게"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={handleItalic}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="기울임"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={handleStrikethrough}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
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
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="인용"
        >
          <Quote size={16} />
        </button>

        <button
          onClick={handleLink}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="링크"
        >
          <Link size={16} />
        </button>

        <button
          onClick={handleImage}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="이미지"
        >
          <Image size={16} />
        </button>

        <button
          onClick={handleCode}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="코드블록"
        >
          <Code size={16} />
        </button>
      </div>
    </div>
  );
}
