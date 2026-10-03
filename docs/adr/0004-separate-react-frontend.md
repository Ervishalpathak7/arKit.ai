### 0004 — Separate React frontend.

## Decision:

backend is a pure JSON API;
React app deploys separately.

## Alternative:

server-rendered templates from Spring (rejected — writing the diagram renderer in JS anyway, and server-side templating buys nothing for a single-page interactive canvas).

## Consequences:

CORS config, two deployments, two repos or a monorepo, and auth later needs tokens rather than server sessions.
