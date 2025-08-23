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
  route("angular-and-redux", "routes/angular-and-redux.tsx"),
  route("circleci-pr-only", "routes/circleci-pr-only.tsx"),
  route("communication", "routes/communication.tsx"),
  route("docker-for-dev", "routes/docker-for-dev.tsx"),
  route("does-tdd-work", "routes/does-tdd-work.tsx"),
  route("elastic-beanstalk-codeship", "routes/elastic-beanstalk-codeship.tsx"),
  route("firing-phasers", "routes/firing-phasers.tsx"),
  route("github-codespaces", "routes/github-codespaces.tsx"),
  route("java-singleton", "routes/java-singleton.tsx"),
  route("javascript-singleton", "routes/javascript-singleton.tsx"),
  route("kube-intro", "routes/kube-intro.tsx"),
  route("slack-sentiment", "routes/slack-sentiment.tsx"),
  route("team-secrets", "routes/team-secrets.tsx"),
  route(
    "tech-stuff-found-2nd-half-2020",
    "routes/tech-stuff-found-2nd-half-2020.tsx"
  ),
  route("understanding-python-async", "routes/understanding-python-async.tsx"),
] satisfies RouteConfig;
