import { Link } from "react-router";
import type { Post } from "~/post";

export default function PostList({
  posts,
}: {
  posts: Omit<Post, "markdown">[];
}) {
  return (
    <ul className="post-list">
      {[...posts]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((post) => (
          <li key={post.slug}>
            <div className="post-summary">
              <h2>
                <Link to={post.slug}>{post.title}</Link>
              </h2>
              {post.description ? <p>{post.description}</p> : null}
            </div>
            <div className="post-meta">
              <time dateTime={post.date}>{post.date}</time>
              {post.draft ? <span className="draft-label">Draft</span> : null}
            </div>
          </li>
        ))}
    </ul>
  );
}
