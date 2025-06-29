"use client";

import { useCallback, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";
import { Eye, Edit3 } from "lucide-react";
import MarkdownToolbar from "./MarkdownToolbar";
import MarkdownPreview from "./MarkdownPreview";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme?: "light" | "dark";
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "당신의 이야기를 적어보세요...",
  theme = "light",
}: MarkdownEditorProps) {
  const editorRef = useRef<any>(null);

  // 에디터 확장 설정
  const extensions = [
    markdown(),
    EditorView.theme({
      "&": {
        fontSize: "16px",
        fontFamily:
          'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      },
      ".cm-content": {
        padding: "16px",
        minHeight: "500px",
        caretColor: "#20b2aa",
      },
      ".cm-focused": {
        outline: "none",
      },
      ".cm-editor": {
        borderRadius: "8px",
      },
      ".cm-scroller": {
        fontFamily: "inherit",
      },
      "&.cm-focused .cm-content": {
        outline: "none",
      },
      // 마크다운 문법 하이라이팅
      ".cm-line": {
        lineHeight: "1.6",
      },
      // 헤딩 스타일
      ".cm-content .tok-heading1": {
        fontSize: "2em",
        fontWeight: "bold",
        color: "#1a202c",
      },
      ".cm-content .tok-heading2": {
        fontSize: "1.5em",
        fontWeight: "bold",
        color: "#2d3748",
      },
      ".cm-content .tok-heading3": {
        fontSize: "1.25em",
        fontWeight: "bold",
        color: "#4a5568",
      },
      // 코드 블록 스타일
      ".cm-content .tok-code": {
        backgroundColor: "#f7fafc",
        padding: "2px 4px",
        borderRadius: "4px",
        fontFamily: "monospace",
      },
      // 링크 스타일
      ".cm-content .tok-link": {
        color: "#3182ce",
        textDecoration: "underline",
      },
      // 볼드 스타일
      ".cm-content .tok-strong": {
        fontWeight: "bold",
      },
      // 이탤릭 스타일
      ".cm-content .tok-emphasis": {
        fontStyle: "italic",
      },
    }),
    EditorView.lineWrapping,
  ];

  // 툴바에서 마크다운 삽입
  const handleInsert = useCallback((markdownText: string) => {
    if (!editorRef.current?.view) return;

    const view = editorRef.current.view;
    const { state } = view;
    const { selection } = state;
    const { main } = selection;

    // 선택된 텍스트가 있으면 대체, 없으면 커서 위치에 삽입
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

  return (
    <div className="grid grid-cols-2 gap-0 overflow-hidden h-[600px]">
      {/* 왼쪽: 에디터 영역 */}
      <div className="flex flex-col">
        {/* 에디터 툴바 */}
        <div className="bg-gray-50">
          <MarkdownToolbar onInsert={handleInsert} />
        </div>

        {/* 에디터 */}
        <div className="flex-1 overflow-hidden">
          <CodeMirror
            ref={editorRef}
            value={value}
            onChange={onChange}
            extensions={extensions}
            theme={theme === "dark" ? oneDark : undefined}
            placeholder={placeholder}
            height="100%"
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: false,
              searchKeymap: true,
            }}
          />
        </div>
      </div>

      {/* 오른쪽: 미리보기 영역 */}
      <div className="flex flex-col bg-white">
        {/* 미리보기 내용 */}
        <div className="flex-1 overflow-y-auto">
          <MarkdownPreview content={value} />
        </div>
      </div>
    </div>
  );
}
