import type { V2_MetaFunction } from "@remix-run/node";

import { Link, useLoaderData } from "@remix-run/react";

import type { Post } from "~/post";
import { getPosts } from "~/post";
export const meta: V2_MetaFunction = () => [{ title: "Ruairí's Site" }];

export const loader = async () => {
  return getPosts();
};


export default function Index() {
  let posts = useLoaderData<Post[]>();
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-4xl">Blog Posts</h1>
      <ul>
        {posts
          .sort((a, b) => (a.date > b.date ? -1 : 1))
          .map((post) => (
            <li
              key={post.slug}
              className="mb-4 flex items-center justify-between rounded border border-gray-600 p-4"
            >
              <div>
                <Link
                  to={post.slug}
                  className="text-2xl font-semibold  no-underline hover:underline"
                >
                  {post.title}
                </Link>
                <p className="mt-2">{post.description}</p>
              </div>
              <span>{post.date}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
