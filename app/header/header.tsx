import { Link, useLocation, useRouteLoaderData } from "react-router";
import type { loader as postLoader } from "~/routes/posts.$slug";
import { setCodeTheme, setSiteTheme, useCodeTheme, useDarkMode } from "~/theme";

function Header() {
  const { pathname } = useLocation();
  const post = useRouteLoaderData<typeof postLoader>("routes/posts.$slug");
  const personal = pathname === "/personal" || post?.section === "personal";

  const dark = useDarkMode();
  const codeTheme = useCodeTheme();

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
        <details className="theme-settings">
          <summary>Theme</summary>
          <div className="theme-settings-panel">
            <div className="theme-setting">
              <span id="site-theme-label">Site theme</span>
              <button
                type="button"
                role="switch"
                aria-labelledby="site-theme-label"
                aria-checked={dark}
                className="theme-switch"
                onClick={() => setSiteTheme(dark ? "light" : "dark")}
              >
                <span>{dark ? "Dark" : "Light"}</span>
                <span className="theme-switch-track" aria-hidden="true" />
              </button>
            </div>
            <div className="theme-setting">
              <span id="code-theme-label">Code theme</span>
              <button
                type="button"
                role="switch"
                aria-labelledby="code-theme-label"
                aria-checked={codeTheme === "dark"}
                className="theme-switch"
                onClick={() =>
                  setCodeTheme(codeTheme === "dark" ? "light" : "dark")
                }
              >
                <span>{codeTheme === "dark" ? "Dark" : "Light"}</span>
                <span className="theme-switch-track" aria-hidden="true" />
              </button>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}

export default Header;
