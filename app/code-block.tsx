import { type ComponentProps, useEffect, useState } from "react";
import type { ExtraProps } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [wrap, setWrap] = useState(true);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle"
  );

  useEffect(() => {
    if (copyStatus !== "copied") return;
    const timer = setTimeout(() => setCopyStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  return (
    <div className="code-example not-prose" data-wrap={wrap}>
      <div className="code-toolbar">
        <span className="code-language">
          {language === "text" ? "Plain text" : language}
        </span>
        <div className="code-actions">
          <button
            type="button"
            aria-pressed={wrap}
            onClick={() => setWrap(!wrap)}
          >
            Wrap lines
          </button>
          <button type="button" onClick={copy}>
            {copyStatus === "copied" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        useInlineStyles={false}
        wrapLongLines={wrap}
        codeTagProps={{ style: { fontFamily: "inherit", fontSize: "inherit" } }}
        tabIndex={0}
        aria-label={`${language === "text" ? "Plain text" : language} example`}
      >
        {code}
      </SyntaxHighlighter>
      <output
        className={copyStatus === "failed" ? "code-copy-error" : "sr-only"}
      >
        {copyStatus === "copied"
          ? "Code copied to clipboard."
          : copyStatus === "failed"
            ? "Could not copy. Select the code and copy it manually."
            : ""}
      </output>
    </div>
  );
}

// Render the Markdown pre node so fenced and indented blocks get one container.
// Inline code remains part of the surrounding sentence.
export default function MarkdownCodeBlock({
  node,
  children,
  ...props
}: ComponentProps<"pre"> & ExtraProps) {
  const codeNode = node?.children[0];
  if (codeNode?.type !== "element" || codeNode.tagName !== "code") {
    return <pre {...props}>{children}</pre>;
  }
  const code = codeNode.children
    .map((child) => (child.type === "text" ? child.value : ""))
    .join("");
  const classNames = codeNode.properties.className;
  const languageClass = Array.isArray(classNames)
    ? classNames.find((name) => String(name).startsWith("language-"))
    : undefined;
  const language = languageClass
    ? String(languageClass).slice("language-".length)
    : "text";
  return <CodeBlock key={code} code={code} language={language} />;
}
