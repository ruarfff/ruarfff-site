import assert from "node:assert/strict";
import { once } from "node:events";
import http from "node:http";
import { test } from "node:test";
import { createRequestHandler } from "react-router";
import * as build from "../build/server/index.js";

const handle = createRequestHandler(build, "production");

test("health checks never contact a caller-supplied host", async () => {
  const requests = [];

  const server = http.createServer((request, response) => {
    requests.push(request.url);
    response.end("listener");
  });

  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const authority = `127.0.0.1:${server.address().port}`;

  try {
    for (const headers of [
      { "X-Forwarded-Host": authority },
      { Host: authority },
      { "X-Forwarded-Host": "[malformed" },
      {},
    ]) {
      for (const method of ["GET", "HEAD"]) {
        const response = await handle(
          new Request("http://site.test/healthcheck", { method, headers })
        );

        assert.equal(response.status, 200);
        assert.equal(await response.text(), method === "HEAD" ? "" : "OK");
        assert.deepEqual(requests, []);
      }
    }
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
