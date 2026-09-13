import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import ReactMarkdown from "react-markdown";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import MarkdownCodeBlock from "./code-block";
import Header from "./header/header";
import { themeScript } from "./theme";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.documentElement.classList.remove("dark");
  delete document.documentElement.dataset.codeTheme;
  localStorage.clear();
});

function renderHeader() {
  const router = createMemoryRouter([{ path: "*", element: <Header /> }]);
  const result = render(<RouterProvider router={router} />);
  fireEvent.click(screen.getByText("Theme", { exact: true }));
  return result;
}

describe("site and code themes", () => {
  it("toggles the actual page theme even when it changes after mount", async () => {
    renderHeader();
    await act(async () => document.documentElement.classList.add("dark"));
    await waitFor(() =>
      expect(screen.getByRole("switch", { name: "Site theme" })).toBeChecked()
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("switch", { name: "Site theme" }));
    });
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
    await waitFor(() =>
      expect(
        screen.getByRole("switch", { name: "Site theme" })
      ).not.toBeChecked()
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("switch", { name: "Site theme" }));
    });
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("shares a code preference without changing the page theme", async () => {
    document.documentElement.dataset.codeTheme = "light";
    renderHeader();
    const { container } = render(
      <ReactMarkdown components={{ pre: MarkdownCodeBlock }}>
        {"```js\nlet first = 1;\n```\n\n```sh\necho second\n```"}
      </ReactMarkdown>
    );
    const selectors = screen.getAllByRole("switch", { name: "Code theme" });
    expect(selectors).toHaveLength(1);
    expect(container.querySelectorAll("select")).toHaveLength(0);
    await act(async () => fireEvent.click(selectors[0]));
    await waitFor(() =>
      expect(document.documentElement.dataset.codeTheme).toBe("dark")
    );
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("code-theme")).toBe("dark");
    await act(async () => fireEvent.click(selectors[0]));
    await waitFor(() => expect(selectors[0]).not.toBeChecked());
    expect(localStorage.getItem("code-theme")).toBe("light");
  });

  it.each([
    "light",
    "dark",
  ])("restores the saved page theme and %s code theme before hydration", (codeTheme) => {
    localStorage.setItem("theme", "dark");
    localStorage.setItem("code-theme", codeTheme);
    new Function(themeScript)();
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.dataset.codeTheme).toBe(codeTheme);
    renderHeader();
    expect(screen.getByRole("switch", { name: "Site theme" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Code theme" })).toHaveAttribute(
      "aria-checked",
      String(codeTheme === "dark")
    );
  });

  it("converts follow-page preferences to an independent saved code theme", async () => {
    localStorage.setItem("theme", "dark");
    localStorage.setItem("code-theme", "site");
    new Function(themeScript)();
    expect(localStorage.getItem("code-theme")).toBe("dark");
    renderHeader();
    await act(async () =>
      fireEvent.click(screen.getByRole("switch", { name: "Site theme" }))
    );
    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement.dataset.codeTheme).toBe("dark");
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it.each([
    false,
    true,
  ])("defaults to light site and dark code when system dark mode is %s", (systemDark) => {
    vi.stubGlobal("matchMedia", () => ({ matches: systemDark }));
    new Function(themeScript)();
    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement.dataset.codeTheme).toBe("dark");
    renderHeader();
    expect(
      screen.getByRole("switch", { name: "Site theme" })
    ).not.toBeChecked();
    expect(screen.getByRole("switch", { name: "Code theme" })).toBeChecked();
  });

  it("uses light site and dark code defaults when storage is unavailable and still toggles", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    new Function(themeScript)();
    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement.dataset.codeTheme).toBe("dark");
    renderHeader();
    await act(async () => {
      fireEvent.click(screen.getByRole("switch", { name: "Site theme" }));
    });
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
  });
});
