import type { V2_MetaFunction } from "@remix-run/node";
import Nav from "~/nav";

export const meta: V2_MetaFunction = () => [{ title: "Ruairí's Site" }];

export default function Index() {
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
