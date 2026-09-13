import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "About | Ruairí's Site" },
  {
    name: "description",
    content:
      "Learn more about Ruairí O'Brien, a Principal Software Engineer based in Minneapolis, United States.",
  },
];

export default function About() {
  return (
    <main className="site-width page-content">
      <div className="page-intro">
        <h1>About</h1>
      </div>
      <div className="about-profile">
        <img
          src="/images/profile-pic.jpg"
          alt="Ruairí O’Brien"
          width="192"
          height="192"
        />
        <div>
          <h2>Ruairí O'Brien</h2>
          <p>Principal Software Engineer at CH Robinson</p>
          <p className="profile-location">Minneapolis, United States.</p>
          <ul aria-label="Social profiles" className="social-profiles">
            <li>
              <a href="https://github.com/ruarfff/">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5a12 12 0 0 0-3.793 23.385c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.419-1.305.762-1.605-2.665-.303-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23a11.52 11.52 0 0 1 6.006 0c2.291-1.553 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.625-5.479 5.922.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .5Z" />
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/ruairitobrien/">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
                </svg>
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://x.com/ruarfff">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.491h2.039L6.487 3.24H4.3l13.31 17.404Z" />
                </svg>
                X
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
