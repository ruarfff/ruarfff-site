import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useOptionalUser } from "~/utils";
import Nav from "~/nav";

export let meta: MetaFunction = () => {
  return {
    title: "Ruairí's Site",
    description: "Welcome to Ruairí's personal site!",
  };
};

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
      <Nav currentPageName="Home" />
      <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
        <div className="relative sm:pb-16 sm:pt-8">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl"></div>
            <h2 className="text-justify">Welcome!</h2>
          </div>
        </div>
      </main>
    </>
  );
}
