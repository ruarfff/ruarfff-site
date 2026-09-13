import type { MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { getPosts } from "~/post";
import PostList from "~/post-list";

export const meta: MetaFunction = () => [
  { title: "Tech blog | Ruairí's Site" },
  {
    name: "description",
    content:
      "Articles by Ruairí O'Brien on programming, machine learning and software engineering.",
  },
];

export const loader = async () => getPosts("tech");

export default function Posts() {
  const posts = useLoaderData<typeof loader>();
  return (
    <main className="site-width page-content">
      <div className="page-intro">
        <h1>Tech blog</h1>
        <p>Programming, machine learning and software engineering.</p>
      </div>
      <PostList posts={posts} />
    </main>
  );
}
