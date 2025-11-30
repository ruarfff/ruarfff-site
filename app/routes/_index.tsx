import type { MetaFunction } from "react-router";

import { Link, useLoaderData } from "react-router";

import type { Post } from "~/post";
import { getPosts } from "~/post";
export const meta: MetaFunction = () => [{ title: "Ruairí's Site" }];

export const loader = async () => {
  return getPosts();
};

export default function Index() {
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
              className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between rounded border border-gray-600 p-4"
            >
              <div>
                <Link
                  to={post.slug}
                  className="text-lg md:text-2xl font-semibold no-underline hover:underline"
                >
                  {post.title}
                </Link>
                <p className="mt-2">{post.description}</p>
                <span className="mt-2 block text-sm text-gray-500 md:hidden">
                  {post.date}
                </span>
              </div>
              <span className="hidden md:block">{post.date}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
