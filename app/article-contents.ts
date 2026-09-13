import { slug } from "github-slugger";
import type { Element, ElementContent, Root, RootContent } from "hast";

function text(node: RootContent): string {
  if (node.type === "text") return node.value;

  if (node.type === "element") return node.children.map(text).join("");

  return "";
}

function element(
  tagName: string,
  children: ElementContent[],
  properties: Element["properties"] = {}
): Element {
  return { type: "element", tagName, properties, children };
}

// Read only empty heading anchors, never arbitrary HTML or code examples.
function legacyAnchor(heading: Element): string | undefined {
  let id: string | undefined;

  for (let index = 0; index < heading.children.length; index++) {
    const child = heading.children[index];

    if (child.type !== "raw") continue;

    const match = child.value.match(
      /^<a\s+(?:name|id)=["']([\w:.-]+)["']\s*>\s*(<\/a>)?$/i
    );

    const next = heading.children[index + 1];

    if (
      !match ||
      (!match[2] && !(next?.type === "raw" && /^<\/a>$/i.test(next.value)))
    )
      continue;
    id ??= match[1];
    heading.children.splice(index, match[2] ? 1 : 2);
    index--;
  }

  const last = heading.children.at(-1);

  if (last?.type === "text") last.value = last.value.trimEnd();

  return id;
}

function contentsList(headings: Element[]): Element {
  const list = element("ul", []);
  const levels = [{ depth: 0, list }];

  for (const heading of headings) {
    const depth = Number(heading.tagName[1]);

    while (levels.length > 1 && depth < levels[levels.length - 1].depth)
      levels.pop();
    let level = levels[levels.length - 1];
    const previous = level.list.children.at(-1);

    if (depth > level.depth && previous?.type === "element") {
      const last = previous.children.at(-1);

      const nested =
        last?.type === "element" && last.tagName === "ul"
          ? last
          : element("ul", []);

      if (nested !== last) previous.children.push(nested);
      level = { depth, list: nested };
      levels.push(level);
    } else if (levels.length === 1) {
      level.depth = depth;
    }

    level.list.children.push(
      element("li", [
        element("a", [{ type: "text", value: text(heading).trim() }], {
          href: `#${encodeURIComponent(String(heading.properties.id))}`,
        }),
      ])
    );
  }

  return list;
}

/** Assign heading targets and enhance explicitly authored contents. */
export default function articleContents() {
  return (tree: Root) => {
    const ids = new Set<string>();

    function visit(parent: Root | Element) {
      for (const child of parent.children) {
        if (child.type !== "element") continue;

        if (/^h[1-6]$/.test(child.tagName)) {
          const base =
            legacyAnchor(child) || slug(text(child).trim()) || "section";

          let id = base;

          for (let suffix = 1; ids.has(id); suffix++) id = `${base}-${suffix}`;
          ids.add(id);
          child.properties.id = id;
          child.properties.tabIndex = -1;
        }

        visit(child);
      }
    }

    visit(tree);

    // Replace an authored Contents heading and its list, preserving its position.
    const authoredIndex = tree.children.findIndex(
      (node) =>
        node.type === "element" &&
        /^h[1-6]$/.test(node.tagName) &&
        /^(contents|table of contents)$/i.test(text(node).trim())
    );

    let insertAt = -1;

    if (authoredIndex !== -1) {
      let end = authoredIndex + 1;

      while (
        tree.children[end]?.type === "text" &&
        text(tree.children[end]).trim() === ""
      )
        end++;
      const next = tree.children[end];

      if (
        next?.type === "element" &&
        (next.tagName === "ul" || next.tagName === "ol")
      ) {
        tree.children.splice(authoredIndex, end - authoredIndex + 1);
        insertAt = authoredIndex;
      }
    }

    if (insertAt === -1) return;

    const headings = tree.children.filter(
      (node): node is Element =>
        node.type === "element" && /^h[2-6]$/.test(node.tagName)
    );

    if (!headings.length) return;
    tree.children.splice(
      insertAt,
      0,
      element(
        "nav",
        [
          element(
            "details",
            [
              element("summary", [{ type: "text", value: "Contents" }]),
              contentsList(headings),
            ],
            { open: true }
          ),
        ],
        {
          ariaLabel: "Table of contents",
          className: ["article-toc", "not-prose"],
        }
      )
    );
  };
}
