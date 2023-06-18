import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import gfm from "remark-gfm";
import invariant from "tiny-invariant";
import { getPost } from "~/post";


export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

export const meta: V2_MetaFunction<typeof loader> = ({
  data,
}) => {
  return [{ title: data.title + "| Ruairí's Site" }];
};

export default function PostSlug() {
  const post = useLoaderData();


  return (
    <div className={`min-h-screen flex flex-col`}>
      <main className="flex-grow p-6">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>
          <p className="mb-4">{post.date}</p>

          <ReactMarkdown remarkPlugins={[gfm]} className="prose dark:prose-dark max-w-none"
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
                <code {...props} className={className + " not-prose"}>
                  {children}
                </code>
              );
            },
          }}>
            {post.markdown}
          </ReactMarkdown>


        </article>
      </main>

    </div>
  );

}
