import fs from "node:fs/promises";
import path from "node:path";
import parseFrontMatter from "front-matter";
import yaml from "js-yaml";
import invariant from "tiny-invariant";

export type Post = {
  slug: string;
  title: string;
  date: string;
  markdown: string;
  description?: string;
  draft: boolean;
  section: "tech" | "personal";
};

const postsPath = path.resolve("posts");

async function readPost(slug: string): Promise<Post> {
  const filepath = path.join(postsPath, slug, "index.md");
  const source = await fs.readFile(filepath, "utf8");
  const { frontmatter, body } = parseFrontMatter(source);
  // Preserve date scalars: YAML timestamp parsing can normalize invalid dates.
  const attributes = yaml.safeLoad(frontmatter ?? "", {
    schema: yaml.JSON_SCHEMA,
  });
  invariant(
    attributes && typeof attributes === "object",
    `${filepath}: invalid metadata`
  );
  const {
    title,
    date,
    description,
    draft = false,
    section = "tech",
  } = attributes as Record<string, unknown>;
  invariant(
    typeof title === "string" && title.trim(),
    `${filepath}: invalid title`
  );
  invariant(
    typeof date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      !Number.isNaN(Date.parse(date)) &&
      new Date(date).toISOString().slice(0, 10) === date,
    `${filepath}: invalid date`
  );
  invariant(
    description === undefined || typeof description === "string",
    `${filepath}: invalid description`
  );
  invariant(typeof draft === "boolean", `${filepath}: invalid draft`);
  invariant(
    section === "tech" || section === "personal",
    `${filepath}: invalid section`
  );
  return { slug, title, date, description, draft, section, markdown: body };
}

function includeDrafts(): boolean {
  return process.env.NODE_ENV === "development";
}

export async function getPosts(section?: Post["section"]) {
  const entries = await fs.readdir(postsPath, { withFileTypes: true });
  const posts = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => readPost(entry.name))
  );
  return posts
    .filter(
      (post) =>
        (includeDrafts() || !post.draft) &&
        (!section || post.section === section)
    )
    .map(({ markdown: _markdown, ...post }) => ({
      ...post,
      slug: `/posts/${post.slug}`,
    }));
}

export async function getPost(slug: string) {
  const post = await readPost(slug).catch((error: unknown) => {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Response("Not Found", { status: 404 });
    }
    throw error;
  });
  if (post.draft && !includeDrafts()) {
    throw new Response("Not Found", { status: 404 });
  }
  return post;
}
