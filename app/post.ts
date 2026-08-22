import fs from "node:fs/promises";
import path from "node:path";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";

export type Post = {
  slug: string;
  title: string;
  date: string;
  markdown: string;
  description?: string;
  draft: boolean;
};

export type PostMarkdownAttributes = {
  title: string;
  date: string;
  description?: string;
  draft?: boolean;
};

const postsPath = path.resolve("posts");

function isValidPostAttributes(
  attributes: unknown
): attributes is PostMarkdownAttributes {
  return (
    typeof attributes === "object" &&
    attributes !== null &&
    "title" in attributes
  );
}

function formatDate(date: unknown): string {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  return String(date || "");
}

function isDraft(attributes: PostMarkdownAttributes): boolean {
  return attributes.draft === true;
}

function includeDrafts(): boolean {
  return process.env.NODE_ENV === "development";
}

export async function getPosts() {
  try {
    const dir = await fs.readdir(postsPath);
    const posts = await Promise.all(
      dir.map(async (filename) => {
        const file = await fs.readFile(
          path.join(postsPath, filename, "index.md")
        );
        const { attributes } = parseFrontMatter(file.toString());
        invariant(
          isValidPostAttributes(attributes),
          `${filename} has bad meta data!`
        );
        return {
          slug: `/posts/${filename.replace(/\.md$/, "")}`,
          title: attributes.title,
          description: attributes.description,
          date: formatDate(attributes.date),
          draft: isDraft(attributes),
        };
      })
    );
    return includeDrafts() ? posts : posts.filter((post) => !post.draft);
  } catch (e) {
    console.log(e);
    return Promise.resolve([]);
  }
}

export async function getPost(slug: string) {
  const filepath = path.join(postsPath, slug, "index.md");
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );
  const draft = isDraft(attributes);
  if (draft && !includeDrafts()) {
    throw new Response("Not Found", { status: 404 });
  }
  return {
    slug,
    markdown: body,
    title: attributes.title,
    description: attributes.description,
    date: formatDate(attributes.date),
    draft,
  };
}
