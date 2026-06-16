import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import parseFrontMatter from "front-matter";

interface PostAttributes {
  title: string;
  date?: string | Date;
  postDate?: string | Date;
  description?: string;
  tags?: string | string[];
  devto_id?: string | number;
  devto_url?: string;
  [key: string]: string | number | string[] | Date | undefined;
}

interface PostItem {
  slug: string;
  filePath: string;
  attributes: PostAttributes;
  body: string;
}

// Load .env file
async function loadEnv() {
  try {
    const envPath = path.resolve(".env");
    const content = await fs.readFile(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.trim().match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  } catch (_err) {
    // Ignore error if .env doesn't exist
  }
}

// Save API key to .env file
async function saveApiKeyToEnv(key: string) {
  const envPath = path.resolve(".env");
  let content = "";
  try {
    content = await fs.readFile(envPath, "utf-8");
  } catch (_e) {
    // file doesn't exist
  }
  
  const lines = content.split("\n");
  let found = false;
  const newLines = lines.map(line => {
    if (line.trim().startsWith("DEVTO_API_KEY=")) {
      found = true;
      return `DEVTO_API_KEY=${key}`;
    }
    return line;
  });

  if (!found) {
    newLines.push(`DEVTO_API_KEY=${key}`);
  }

  await fs.writeFile(envPath, newLines.join("\n"), "utf-8");
  console.log(`\x1b[32m✔ Saved API key to ${envPath}\x1b[0m`);
}

// Ask question in CLI
function ask(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
}

// Simple YAML stringifier
function stringifyYAML(obj: Record<string, unknown>): string {
  let yaml = "---\n";
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      yaml += `${key}:\n`;
      for (const item of value) {
        yaml += `  - ${item}\n`;
      }
    } else if (typeof value === "object" && !(value instanceof Date)) {
      yaml += `${key}:\n`;
      const nested = Object.entries(value)
        .map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`)
        .join("\n");
      yaml += `${nested}\n`;
    } else {
      let valStr = "";
      if (value instanceof Date) {
        valStr = value.toISOString().split("T")[0];
      } else if (typeof value === "string") {
        const needsQuotes = /[:#\-,[\]{}&*!|>'"%@`\x60]|^[ \t]|[ \t]$/.test(value) || value.includes("\n");
        if (value.includes("\n")) {
          valStr = `|-\n  ${value.replace(/\n/g, "\n  ")}`;
        } else if (needsQuotes) {
          valStr = JSON.stringify(value);
        } else {
          valStr = value;
        }
      } else {
        valStr = String(value);
      }
      yaml += `${key}: ${valStr}\n`;
    }
  }
  yaml += "---\n";
  return yaml;
}

// Rewrite relative image paths to absolute production paths
function rewriteImages(markdown: string, slug: string, host: string): string {
  // Regex matches: ![alt](url)
  return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return match;
    }
    if (url.startsWith("/")) {
      return `![${alt}](${host}${url})`;
    }
    const cleanUrl = url.replace(/^\.\//, "");
    return `![${alt}](${host}/images/${slug}/${cleanUrl})`;
  });
}

function formatDate(date: unknown): string {
  if (!date) return "";
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  return String(date);
}

async function getPosts(): Promise<PostItem[]> {
  const postsDir = path.resolve("posts");
  const entries = await fs.readdir(postsDir, { withFileTypes: true });
  const posts: PostItem[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const slug = entry.name;
      const filePath = path.join(postsDir, slug, "index.md");
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const fm = parseFrontMatter<PostAttributes>(fileContent);
        posts.push({
          slug,
          filePath,
          attributes: fm.attributes,
          body: fm.body,
        });
      } catch (_err) {
        // Skip directory if it doesn't contain a valid index.md
      }
    }
  }

  // Sort by date desc
  return posts.sort((a, b) => {
    const dateA = formatDate(a.attributes.date || a.attributes.postDate);
    const dateB = formatDate(b.attributes.date || b.attributes.postDate);
    return dateB.localeCompare(dateA);
  });
}

async function run() {
  console.log("\x1b[36m\x1b[1m=== DEV.to Blog Publisher ===\x1b[0m\n");
  
  await loadEnv();

  let apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) {
    console.log("\x1b[33mDEVTO_API_KEY environment variable is not set.\x1b[0m");
    apiKey = await ask("Enter your Dev.to API Key: ");
    apiKey = apiKey.trim();
    if (!apiKey) {
      console.error("\x1b[31mError: Dev.to API Key is required to publish.\x1b[0m");
      process.exit(1);
    }
    const saveEnv = await ask("Would you like to save this key to your local .env file? (y/n): ");
    if (saveEnv.toLowerCase().startsWith("y")) {
      await saveApiKeyToEnv(apiKey);
    }
  }

  const canonicalHost = process.env.CANONICAL_HOST || "https://ruarfff.com";
  const posts = await getPosts();

  if (posts.length === 0) {
    console.error("\x1b[31mNo blog posts found in 'posts/' directory.\x1b[0m");
    process.exit(1);
  }

  let selectedPost: PostItem | undefined;
  const args = process.argv.slice(2);
  const cliSlug = args[0];

  if (cliSlug) {
    selectedPost = posts.find(p => p.slug === cliSlug);
    if (!selectedPost) {
      console.error(`\x1b[31mError: Post with slug '${cliSlug}' not found.\x1b[0m`);
      console.log("\nAvailable posts:");
      posts.forEach((p) => {
        console.log(` - ${p.slug}`);
      });
      process.exit(1);
    }
  } else {
    console.log("Select a post to publish:");
    posts.forEach((p, idx) => {
      const dateStr = formatDate(p.attributes.date || p.attributes.postDate) || "No Date";
      const status = p.attributes.devto_id ? `\x1b[32mPublished (ID: ${p.attributes.devto_id})\x1b[0m` : "\x1b[33mUnpublished\x1b[0m";
      console.log(`  ${String(idx + 1).padStart(2)}. [${dateStr}] ${p.slug.padEnd(40)} - ${status}`);
    });
    console.log("");

    const answer = await ask("Enter the number of the post: ");
    const num = parseInt(answer.trim(), 10);
    if (Number.isNaN(num) || num < 1 || num > posts.length) {
      console.error("\x1b[31mInvalid selection.\x1b[0m");
      process.exit(1);
    }
    selectedPost = posts[num - 1];
  }

  const { slug, filePath, attributes, body } = selectedPost;
  const isUpdate = !!attributes.devto_id;

  console.log(`\n\x1b[36mProcessing: ${attributes.title} (${slug})\x1b[0m`);
  
  if (isUpdate) {
    console.log(`Status: Already published to Dev.to (ID: ${attributes.devto_id}, URL: ${attributes.devto_url})`);
    const confirmUpdate = await ask("Do you want to update the existing Dev.to post? (y/n): ");
    if (!confirmUpdate.toLowerCase().startsWith("y")) {
      console.log("Cancelled.");
      process.exit(0);
    }
  } else {
    console.log("Status: Creating a new Dev.to post (as draft)");
  }

  // Rewrite images in body
  const processedBody = rewriteImages(body, slug, canonicalHost);
  const canonicalUrl = `${canonicalHost}/posts/${slug}`;

  // Parse tags
  let tags: string[] = [];
  if (Array.isArray(attributes.tags)) {
    tags = attributes.tags.map(t => String(t).trim().toLowerCase());
  } else if (typeof attributes.tags === "string") {
    tags = attributes.tags.split(",").map(t => t.trim().toLowerCase());
  }

  // Construct request payload
  const articlePayload = {
    article: {
      title: attributes.title,
      body_markdown: processedBody,
      published: isUpdate ? undefined : false, // For updates, Forem recommends not changing publication status unless intended. For new ones, create as draft (published: false)
      canonical_url: canonicalUrl,
      description: attributes.description || "",
      tags: tags.slice(0, 4), // Forem API limits to 4 tags max
    }
  };

  const url = isUpdate 
    ? `https://dev.to/api/articles/${attributes.devto_id}`
    : "https://dev.to/api/articles";
  
  const method = isUpdate ? "PUT" : "POST";

  console.log(`\nSending request to DEV.to (${method} ${url})...`);

  try {
    let response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        "accept": "application/vnd.forem.api-v1+json",
      },
      body: JSON.stringify(articlePayload),
    });

    if (response.status === 404 && isUpdate) {
      console.log("\x1b[33mDev.to returned 404. Checking if the article exists under a different ID...\x1b[0m");
      const meRes = await fetch("https://dev.to/api/articles/me/all", {
        headers: {
          "api-key": apiKey,
          "accept": "application/vnd.forem.api-v1+json",
        }
      });
      if (meRes.ok) {
        interface DevToArticle {
          id: number;
          slug: string;
          url: string;
          title: string;
        }
        const myArticles = (await meRes.json()) as DevToArticle[];
        const matchingArticle = myArticles.find(
          art => 
            art.slug === slug || 
            art.url.includes(slug) || 
            art.title.toLowerCase() === attributes.title.toLowerCase()
        );
        if (matchingArticle) {
          console.log(`\x1b[32m✔ Found matching article on Dev.to with correct ID: ${matchingArticle.id}.\x1b[0m`);
          console.log("Updating local frontmatter and retrying...");
          attributes.devto_id = matchingArticle.id;
          attributes.devto_url = matchingArticle.url;
          const retryUrl = `https://dev.to/api/articles/${matchingArticle.id}`;
          response = await fetch(retryUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "api-key": apiKey,
              "accept": "application/vnd.forem.api-v1+json",
            },
            body: JSON.stringify(articlePayload),
          });
        }
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Dev.to API error (${response.status}): ${errorText}`);
    }

    const result = (await response.json()) as { id: number; url: string };

    console.log(`\n\x1b[32m✔ Success! Post ${isUpdate ? "updated" : "created"} on Dev.to.\x1b[0m`);
    console.log(`Dev.to URL: \x1b[34m${result.url}\x1b[0m`);

    // If it's a new post or metadata changed, update local index.md
    if (!attributes.devto_id || attributes.devto_id !== result.id || attributes.devto_url !== result.url) {
      console.log("Updating local markdown file with devto_id and devto_url...");
      const updatedAttributes = {
        ...attributes,
        devto_id: result.id,
        devto_url: result.url,
      } as Record<string, unknown>;

      const newContent = stringifyYAML(updatedAttributes) + body;
      await fs.writeFile(filePath, newContent, "utf-8");
      console.log(`\x1b[32m✔ Updated frontmatter in ${filePath}\x1b[0m`);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`\x1b[31mError publishing to Dev.to: ${msg}\x1b[0m`);
    process.exit(1);
  }
}

run();
