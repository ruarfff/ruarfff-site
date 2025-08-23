import * as build from "virtual:react-router/server-build";
import { createRequestHandler } from "@react-router/node";

export const handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});
