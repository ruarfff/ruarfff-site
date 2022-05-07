import { Link, useLoaderData } from "remix";
import { getPosts } from "~/post";
import type { Post } from "~/post";

export const loader = async () => {
  return getPosts();
};

export default function Posts() {
  let posts = useLoaderData<Post[]>();
  return (
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
  );
}
