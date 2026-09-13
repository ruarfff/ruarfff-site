import { useSyncExternalStore } from "react";

export type CodeTheme = "light" | "dark";

// Apply saved preferences before paint. React observes these root attributes.
export const themeScript = `
  (() => {
    let siteTheme;
    let codeTheme;
    try {
      siteTheme = localStorage.getItem('theme');
      codeTheme = localStorage.getItem('code-theme');
    } catch (_) {}
    const dark = siteTheme === 'dark' || (siteTheme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    const resolvedCodeTheme = codeTheme === 'light' || codeTheme === 'dark' ? codeTheme : dark ? 'dark' : 'light';
    document.documentElement.dataset.codeTheme = resolvedCodeTheme;
    try { localStorage.setItem('code-theme', resolvedCodeTheme); } catch (_) {}
  })();
`;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-code-theme"],
  });
  return () => observer.disconnect();
}

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The current page still changes when browser storage is unavailable.
  }
}

export function useDarkMode() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );
}

export function setSiteTheme(theme: string) {
  if (theme !== "light" && theme !== "dark") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  save("theme", theme);
}

export function useCodeTheme(): CodeTheme {
  return useSyncExternalStore(
    subscribe,
    () => {
      const value = document.documentElement.dataset.codeTheme;
      return value === "dark" ? "dark" : "light";
    },
    () => "light"
  );
}

export function setCodeTheme(theme: string) {
  if (theme !== "light" && theme !== "dark") return;
  document.documentElement.dataset.codeTheme = theme;
  save("code-theme", theme);
}
