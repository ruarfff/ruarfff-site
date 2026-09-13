import { useEffect, useState } from "react";
import { Link, useLocation, useMatches } from "react-router";

function Header() {
  const { pathname } = useLocation();
  const matches = useMatches();
  const personal =
    pathname === "/personal" ||
    matches.some(
      ({ loaderData: data }) =>
        data &&
        typeof data === "object" &&
        "section" in data &&
        data.section === "personal"
    );
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* Theme still works without storage. */
    }
    setDark(next);
  }

  return (
    <header className="site-header">
      <div className="site-width header-inner">
        <Link to="/" className="site-name">
          Ruairí's Site
        </Link>
        <nav aria-label="Main navigation">
          <Link
            to="/"
            aria-current={
              !personal && (pathname === "/" || pathname.startsWith("/posts"))
                ? "page"
                : undefined
            }
          >
            Tech blog
          </Link>
          <Link to="/personal" aria-current={personal ? "page" : undefined}>
            Personal
          </Link>
          <Link
            to="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            About
          </Link>
        </nav>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {dark ? (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
              </>
            ) : (
              <path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;
