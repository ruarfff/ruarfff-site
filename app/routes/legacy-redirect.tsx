import { type LoaderFunctionArgs, redirect } from "react-router";

export const loader = async ({ url }: LoaderFunctionArgs) => {
  const slug = url.pathname.split("/").filter(Boolean).pop();
  if (!slug) {
    return redirect("/");
  }
  return redirect(`/posts/${slug}`);
};
