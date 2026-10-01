### 0002 — Orthogonal edge axes.

## Decision: 
separate direction and communication fields.

direction:
  ONE_WAY — the target sends no response (fire-and-forget, queue publish)
  BIDIRECTIONAL — the caller receives a response, including any read query

communication:
  SYNC — the caller blocks waiting for the result
  ASYNC — the caller does not wait; delivery happens via queue, stream, or callback
  (Judge the call itself, not whether a human is waiting.)

## Alternative: 
single combined enum (rejected — cross product; a third axis doubles it again). 

## Consequences: 
callers must handle four combinations; 
request/response isn't a value because it's derivable.