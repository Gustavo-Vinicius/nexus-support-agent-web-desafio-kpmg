import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  p: ({ children }) => (
    <p className="text-sm leading-[150%] text-text [&:not(:first-child)]:mt-2">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-2 flex list-disc flex-col gap-1 pl-5 text-sm leading-[150%] text-text">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 flex list-decimal flex-col gap-1 pl-5 text-sm leading-[150%] text-text">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="text-sm leading-[150%]">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#4F46E5] underline"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => (
    <p className="text-sm font-semibold leading-[150%] text-text">{children}</p>
  ),
  h2: ({ children }) => (
    <p className="text-sm font-semibold leading-[150%] text-text">{children}</p>
  ),
  h3: ({ children }) => (
    <p className="text-sm font-semibold leading-[150%] text-text">{children}</p>
  ),
  code: ({ children }) => (
    <code className="rounded bg-bg px-1 py-0.5 text-[0.9em] text-text">
      {children}
    </code>
  ),
};

type AssistantMarkdownProps = {
  content: string;
};

export function AssistantMarkdown({ content }: AssistantMarkdownProps) {
  return (
    <div className="text-sm leading-[150%] text-text">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
