// Legacy to support old links
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return redirect("/posts/tech-stuff-found-2nd-half-2020");
};
