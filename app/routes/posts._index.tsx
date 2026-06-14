import type { MetaFunction } from "react-router";

import { Link, useLoaderData } from "react-router";

import type { Post } from "~/post";
import { getPosts } from "~/post";
export const meta: MetaFunction = () => [
  { title: "Blog Posts | Ruairí's Site" },
  {
    name: "description",
    content:
      "Browse articles and tutorials written by Ruairí O'Brien covering programming singletons, Kubernetes, Python async, dev setup, and machine learning agents.",
  },
];

export const loader = async () => {
  return getPosts();
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl md:text-4xl">Blog Posts</h1>
      <ul>
        {posts
          .sort((a, b) => (a.date > b.date ? -1 : 1))
          .map((post) => (
            <li
              key={post.slug}
              className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between rounded border border-gray-600 dark:border-gray-700 p-4 transition-colors duration-200"
            >
              <div>
                <Link
                  to={post.slug}
                  className="text-lg md:text-2xl font-semibold no-underline hover:underline text-gray-900 dark:text-gray-100"
                >
                  {post.title}
                </Link>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>
                <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400 md:hidden">
                  {post.date}
                </span>
              </div>
              <span className="hidden md:block text-gray-500 dark:text-gray-400">
                {post.date}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
