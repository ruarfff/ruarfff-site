import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "About | Ruairí's Site" },
  {
    name: "description",
    content:
      "Learn more about Ruairí O'Brien, a programmer and Machine Learning Engineer based in Cork, Ireland.",
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
          <p>
            Programmer currently working as a Machine Learning Engineer at CH
            Robinson
          </p>
          <p className="profile-location">Cork. Ireland.</p>
          <a href="https://github.com/ruarfff/">GitHub</a>
        </div>
      </div>
    </main>
  );
}
