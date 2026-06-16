import { type LoaderFunctionArgs, redirect } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const slug = url.pathname.split("/").filter(Boolean).pop();
  if (!slug) {
    return redirect("/");
  }
  return redirect(`/posts/${slug}`);
};
