"use client";

import { getImageUrl } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-lg max-w-none bg-white p-10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // @ts-ignore
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "javascript";
            const codeContent = String(children).replace(/\n$/, "");

            console.log(
              "언어 감지:",
              language,
              "클래스명:",
              className,
              "inline:",
              inline,
              "내용:",
              codeContent.slice(0, 50)
            );

            // 짧은 코드나 한 줄 코드는 인라인으로 처리
            const isReallyInline =
              inline ||
              (!codeContent.includes("\n") && codeContent.length < 50);

            if (isReallyInline) {
              return (
                <code
                  className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // 모든 블록 코드에 구문 강조 적용
            return (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={language}
                PreTag="div"
                className="rounded-lg my-4"
                showLineNumbers={false} // 줄 번호 제거
                customStyle={{
                  margin: "16px 0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "#f8f9fa", // 밝은 배경으로 변경
                  padding: "16px",
                }}
                codeTagProps={{
                  style: {
                    backgroundColor: "transparent", // 코드 태그 배경 투명
                    color: "#1e293b", // 어두운 텍스트 색상
                  },
                }}
              >
                {codeContent}
              </SyntaxHighlighter>
            );
          },

          // 헤딩 스타일
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-bold text-gray-900 mt-5 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-bold text-gray-900 mt-4 mb-2">
              {children}
            </h4>
          ),

          // 인용문 스타일
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 text-gray-700 bg-gray-50 italic">
              {children}
            </blockquote>
          ),

          // 링크 스타일
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // 이미지 스타일
          img: ({ src, alt }) => {
            const imageSrc = typeof src === "string" ? src : undefined;
            const finalSrc = getImageUrl(imageSrc);

            return (
              <img
                src={finalSrc || (typeof src === "string" ? src : "")}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-md my-4"
              />
            );
          },

          // 테이블 스타일
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-300">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2">{children}</td>
          ),

          // 리스트 스타일
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-4 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-gray-700">{children}</li>,

          // 단락 스타일
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
          ),

          // 구분선 스타일
          hr: () => <hr className="border-t border-gray-300 my-6" />,
        }}
      >
        {content
          .replace(/\n/gi, "\n\n")
          .replace(/\*\*/gi, "@$_%!^")
          .replace(/@\$_%!\^/gi, "**")
          .replace(/<\/?u>/gi, "*") || "*미리보기할 내용이 없습니다.*"}
      </ReactMarkdown>
    </div>
  );
}
