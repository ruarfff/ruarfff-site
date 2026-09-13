import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ReactMarkdown from "react-markdown";
import { afterEach, describe, expect, it, vi } from "vitest";
import MarkdownCodeBlock from "./code-block";

function renderExample(markdown: string) {
  return render(
    <ReactMarkdown components={{ pre: MarkdownCodeBlock }}>
      {markdown}
    </ReactMarkdown>
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("code examples", () => {
  it.each([
    ["bash", 'echo "hello"'],
    ["shell", 'echo "hello"'],
    ["python", "def example(): return True"],
    ["javascript", "const count = 1;"],
    ["yaml", "enabled: true"],
    ["html", "<p>Example</p>"],
    ["json", '{"enabled":true}'],
    ["toml", "enabled = true"],
    ["ini", "[section]\nenabled=true"],
    ["docker", "FROM node:22"],
    ["markdown", "# Heading"],
    ["java", "public class Example {}"],
    ["css", "p { color: red; }"],
    ["nix", "{ enabled = true; }"],
  ])("highlights the post language %s", (language, code) => {
    const { container } = renderExample(`\`\`\`${language}\n${code}\n\`\`\``);
    expect(container.querySelector(".token")).not.toBeNull();
    expect(container.querySelector("pre code")?.textContent).toBe(`${code}\n`);
  });

  it("renders highlighted code in one pre, preserving whitespace", () => {
    const code =
      'const url = "https://example.com/a/very/long/path";\n\tconsole.log(url);\n';

    const { container } = renderExample(`\`\`\`javascript\n${code}\`\`\``);

    expect(container.querySelectorAll("pre")).toHaveLength(1);
    expect(container.querySelector("pre pre")).toBeNull();
    expect(container.querySelector("pre code")?.textContent).toBe(code);
    expect(container.querySelector(".token.keyword")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Wrap lines" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it.each([
    "",
    "text",
    "some-unknown-language",
  ])("handles fences with language '%s'", (language) => {
    const { container } = renderExample(
      `\`\`\`${language}\nplain output\n\`\`\``
    );

    expect(container.querySelector("pre code")?.textContent).toBe(
      "plain output\n"
    );
    expect(screen.getByRole("button", { name: "Copy" })).toBeVisible();
  });

  it("supports indented blocks while keeping inline code inline", () => {
    const { container } = renderExample(
      "Run `npm test` first.\n\n    npm run build\n"
    );

    expect(container.querySelector("p code")?.textContent).toBe("npm test");
    expect(container.querySelectorAll(".code-example")).toHaveLength(1);
    expect(container.querySelector("pre code")?.textContent).toBe(
      "npm run build\n"
    );
  });

  it("toggles wrapping without changing copied commands or line breaks", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    const command =
      'curl "https://example.com/api?one=1&two=2" \\\n  --header "Accept: application/json"\n';

    const { container } = renderExample(`\`\`\`bash\n${command}\`\`\``);

    fireEvent.click(screen.getByRole("button", { name: "Wrap lines" }));
    expect(container.querySelector(".code-example")).toHaveAttribute(
      "data-wrap",
      "false"
    );
    expect(container.querySelector("pre code")?.textContent).toBe(command);
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Code copied to clipboard."
      )
    );
    expect(writeText).toHaveBeenCalledWith(command);
  });

  it("keeps code available when clipboard access fails", async () => {
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error("Not allowed")),
      },
    });
    const { container } = renderExample("```sh\nnpm test\n```");
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Could not copy. Select the code and copy it manually."
      )
    );
    expect(container.querySelector("pre code")?.textContent).toBe("npm test\n");
  });
});
