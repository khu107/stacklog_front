// utils/codemirror-extensions.ts
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";

// MarkdownEditor용 확장 (원본 그대로)
export const markdownEditorExtensions = [
  markdown(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
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

// WritePage용 확장 (원본 그대로)
export const writePageExtensions = [
  markdown(),
  EditorView.theme({
    "&": {
      fontSize: "16px",
      fontFamily:
        'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },
    ".cm-content": {
      padding: "0px 3rem",
      caretColor: "#20b2aa",
    },
    ".cm-line": {
      lineHeight: "1.6",
    },
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
    ".cm-content .tok-code": {
      backgroundColor: "#f7fafc",
      padding: "2px 4px",
      borderRadius: "4px",
      fontFamily: "monospace",
    },
    ".cm-content .tok-link": {
      color: "#3182ce",
      textDecoration: "underline",
    },
    ".cm-content .tok-strong": {
      fontWeight: "bold",
    },
    ".cm-content .tok-emphasis": {
      fontStyle: "italic",
    },
  }),
  EditorView.lineWrapping,
];

// 공통 basicSetup 설정
export const commonBasicSetup = {
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
};
