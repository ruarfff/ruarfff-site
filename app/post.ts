import fs from "node:fs/promises";
import path from "node:path";
import parseFrontMatter from "front-matter";
import yaml from "js-yaml";
import { z } from "zod";

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

const postMetadata = z.object({
  title: z.string().refine((title) => title.trim().length > 0),
  date: z.iso.date(),
  description: z.string().optional(),
  draft: z.boolean().default(false),
  section: z.enum(["tech", "personal"]).default("tech"),
});

async function readPost(slug: string): Promise<Post> {
  const filepath = path.join(postsPath, slug, "index.md");
  const source = await fs.readFile(filepath, "utf8");
  const { frontmatter, body } = parseFrontMatter(source);

  // Preserve date scalars: YAML timestamp parsing can normalize invalid dates.
  const attributes = yaml.safeLoad(frontmatter ?? "", {
    schema: yaml.JSON_SCHEMA,
  });

  const result = postMetadata.safeParse(attributes);

  if (!result.success) {
    const field = result.error.issues[0]?.path.join(".") || "metadata";

    throw new Error(`${filepath}: invalid ${field}`);
  }

  return { slug, ...result.data, markdown: body };
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
  let post: Post;

  try {
    post = await readPost(slug);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Response("Not Found", { status: 404 });
    }

    throw error;
  }

  if (post.draft && !includeDrafts()) {
    throw new Response("Not Found", { status: 404 });
  }

  return post;
}
