"use client";

import { useCallback, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorSelection } from "@codemirror/state";
import { Eye, Edit3 } from "lucide-react";
import MarkdownToolbar from "./MarkdownToolbar";
import MarkdownPreview from "./MarkdownPreview";
import {
  markdownEditorExtensions,
  commonBasicSetup,
} from "@/lib/codemirror-extensions";

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
            extensions={markdownEditorExtensions}
            theme={theme === "dark" ? oneDark : undefined}
            placeholder={placeholder}
            height="100%"
            basicSetup={commonBasicSetup}
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
