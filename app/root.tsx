import { useEffect } from "react";
import type { MetaFunction } from "react-router";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router";
import * as gtag from "~/utils/gtags.client";
import Header from "./header/header";
import { themeScript } from "./theme";
import "./styles/app.css";

export const loader = async () => {
  return { gaTrackingId: "G-J8S0YBL54N" };
};

export const meta: MetaFunction = () => {
  return [{ title: "Ruairí's Site" }];
};

export default function App() {
  const location = useLocation();
  const { gaTrackingId } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: required to prevent flash of unstyled content
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>
      <body
        className="font-mono bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen transition-colors duration-200"
        suppressHydrationWarning={true}
      >
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
        />
        <script
          async
          id="gtag-init"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: required for google analytics
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gaTrackingId}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <Header />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
