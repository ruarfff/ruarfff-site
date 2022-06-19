import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/post";
import type { Post } from "~/post";
import Nav from "~/nav";

export const loader = async () => {
  return getPosts();
};

export default function Posts() {
  let posts = useLoaderData<Post[]>();
  return (
    <>
      <Nav currentPageName="Blog" />
      <div>
        <h1>Blog Posts</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={post.slug}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
