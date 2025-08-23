import { createRequestHandler } from "@react-router/node";
import * as build from "virtual:react-router/server-build";

export const handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});
