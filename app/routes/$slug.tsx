import type { LoaderFunction } from "remix";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  const legacyRedirect = new Set<string>([
    "circleci-pr-only",
    "slack-sentiment",
    "github-codespaces",
    "team-secrets",
    "tech-stuff-found-2nd-half-2020",
    "does-tdd-work",
    "docker-for-dev",
    "elastic-beanstalk-codeship",
    "angular-and-redux",
    "kube-intro",
    "firing-phasers",
    "communication",
    "javascript-singleton",
    "java-singleton",
  ]);

  if (legacyRedirect.has(params.slug ?? "")) {
    return redirect("posts/" + params.slug);
  }
  return null;
};
