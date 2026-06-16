import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("about", "routes/about.tsx"),
  route("healthcheck", "routes/healthcheck.tsx"),

  // Blog routes
  route("posts", "routes/posts.tsx", [
    index("routes/posts._index.tsx"),
    route(":slug", "routes/posts.$slug.tsx"),
  ]),

  // Individual post routes (legacy support)
  route("angular-and-redux", "routes/legacy-redirect.tsx", {
    id: "legacy-angular-and-redux",
  }),
  route("circleci-pr-only", "routes/legacy-redirect.tsx", {
    id: "legacy-circleci-pr-only",
  }),
  route("communication", "routes/legacy-redirect.tsx", {
    id: "legacy-communication",
  }),
  route("docker-for-dev", "routes/legacy-redirect.tsx", {
    id: "legacy-docker-for-dev",
  }),
  route("does-tdd-work", "routes/legacy-redirect.tsx", {
    id: "legacy-does-tdd-work",
  }),
  route("elastic-beanstalk-codeship", "routes/legacy-redirect.tsx", {
    id: "legacy-elastic-beanstalk-codeship",
  }),
  route("firing-phasers", "routes/legacy-redirect.tsx", {
    id: "legacy-firing-phasers",
  }),
  route("github-codespaces", "routes/legacy-redirect.tsx", {
    id: "legacy-github-codespaces",
  }),
  route("java-singleton", "routes/legacy-redirect.tsx", {
    id: "legacy-java-singleton",
  }),
  route("javascript-singleton", "routes/legacy-redirect.tsx", {
    id: "legacy-javascript-singleton",
  }),
  route("kube-intro", "routes/legacy-redirect.tsx", {
    id: "legacy-kube-intro",
  }),
  route("slack-sentiment", "routes/legacy-redirect.tsx", {
    id: "legacy-slack-sentiment",
  }),
  route("team-secrets", "routes/legacy-redirect.tsx", {
    id: "legacy-team-secrets",
  }),
  route("tech-stuff-found-2nd-half-2020", "routes/legacy-redirect.tsx", {
    id: "legacy-tech-stuff-found-2nd-half-2020",
  }),
  route("understanding-python-async", "routes/legacy-redirect.tsx", {
    id: "legacy-understanding-python-async",
  }),
] satisfies RouteConfig;
