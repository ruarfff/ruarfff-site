import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import invariant from "tiny-invariant";
import { getPost } from "~/post";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

export default function PostSlug() {
  const post = useLoaderData();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mb-12">
        <h1 className="mb-2 text-4xl text-orange-500">{post.title}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-yellow-400">{post.date}</span>
        </div>
      </header>
      <article className="prose rounded border border-gray-600 bg-gray-800 p-6 leading-relaxed lg:prose-xl">
        <ReactMarkdown
          children={post.markdown}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, "")}
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                />
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },
          }}
        />
      </article>
    </div>
  );
}
