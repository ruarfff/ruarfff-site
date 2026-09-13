import ReactMarkdown from "react-markdown";
import { Link, useLoaderData } from "react-router";
import gfm from "remark-gfm";
import invariant from "tiny-invariant";
import articleContents from "~/article-contents";
import MarkdownCodeBlock from "~/code-block";
import { getPost } from "~/post";
import type { Route } from "./+types/posts.$slug";

export const loader = async ({ params }: Route.LoaderArgs) => {
  invariant(params.slug, "expected params.slug");

  return getPost(params.slug);
};

export const meta: Route.MetaFunction = ({ loaderData: post }) => {
  return [
    { title: `${post?.title} | Ruairí's Site` },
    {
      name: "description",
      content: post?.description || `Read "${post?.title}" by Ruairí O'Brien.`,
    },
  ];
};

export default function PostSlug() {
  const post = useLoaderData<typeof loader>();

  let imageIndex = 0;

  return (
    <div className={`min-h-screen flex flex-col`}>
      <main className="flex-grow p-4 md:p-6">
        <article className="max-w-4xl mx-auto">
          <Link
            className="mb-6 inline-block text-sm underline"
            to={post.section === "personal" ? "/personal" : "/"}
          >
            {post.section === "personal"
              ? "Back to Personal"
              : "Back to Tech blog"}
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold mb-4">
            {post.title}
          </h1>
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <p>{post.date}</p>
            {post.draft ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                Draft preview
              </span>
            ) : null}
          </div>

          <ReactMarkdown
            remarkPlugins={[gfm]}
            rehypePlugins={[articleContents]}
            className="prose prose-lg md:prose-xl dark:prose-invert max-w-none"
            components={{
              img: ({ src, alt, node: _node, ...props }) => {
                let transformedSrc = src;

                if (src && !src.startsWith("/") && !src.startsWith("http")) {
                  transformedSrc = `/images/${post.slug}/${src}`;
                }

                const image = src
                  ? post.images[src.replace(/^\.\//, "")]
                  : undefined;

                const initial = imageIndex++ === 0;

                return (
                  <img
                    {...props}
                    src={transformedSrc}
                    alt={alt}
                    width={image?.width}
                    height={image?.height}
                    srcSet={image?.srcSet}
                    sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 943px) calc(100vw - 48px), 896px"
                    loading={initial ? "eager" : "lazy"}
                    decoding="async"
                  />
                );
              },
              pre: MarkdownCodeBlock,
            }}
          >
            {post.markdown}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
