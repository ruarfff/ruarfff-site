// Legacy to support old links
import type { LoaderFunction } from "react-router";
import { redirect } from "react-router";

export const loader: LoaderFunction = async () => {
  return redirect("/posts/tech-stuff-found-2nd-half-2020");
};
