import type { MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { getPosts } from "~/post";
import PostList from "~/post-list";

export const meta: MetaFunction = () => [
  { title: "Personal | Ruairí's Site" },
  {
    name: "description",
    content:
      "Personal writing by Ruairí O'Brien. Stories, notes and life outside the tech blog.",
  },
];

export const loader = async () => getPosts("personal");

export default function Personal() {
  const posts = useLoaderData<typeof loader>();
  return (
    <main className="site-width page-content">
      <div className="page-intro">
        <h1>Personal</h1>
        <p>Stories, notes and life outside the tech blog.</p>
      </div>
      {posts.length ? (
        <PostList posts={posts} />
      ) : (
        <div className="empty-writing">
          <p>No personal posts yet.</p>
          <Link to="/">Read the tech blog</Link>
        </div>
      )}
    </main>
  );
}
