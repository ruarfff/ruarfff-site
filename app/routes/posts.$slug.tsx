import ReactMarkdown from "react-markdown";
import type { LoaderFunction, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import gfm from "remark-gfm";
import invariant from "tiny-invariant";
import { getPost, type Post } from "~/post";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.title}| Ruairí's Site` }];
};

export default function PostSlug() {
  const post = useLoaderData<Post>();

  return (
    <div className={`min-h-screen flex flex-col`}>
      <main className="flex-grow p-4 md:p-6">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold mb-4">
            {post.title}
          </h1>
          <p className="mb-4">{post.date}</p>

          <ReactMarkdown
            remarkPlugins={[gfm]}
            className="prose prose-lg md:prose-xl dark:prose-invert max-w-none"
            components={{
              img: ({ src, alt, ...props }) => {
                let transformedSrc = src;
                if (src && !src.startsWith("/") && !src.startsWith("http")) {
                  transformedSrc = `/images/${post.slug}/${src}`;
                }
                return <img src={transformedSrc} alt={alt} {...props} />;
              },
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props} className={`${className || ""} not-prose`}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.markdown}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
