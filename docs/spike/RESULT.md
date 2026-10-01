# Spike: LLM schema adherence

Question: can an LLM reliably produce our node/edge JSON contract?

## v1 prompt (3 runs)
- Valid JSON: 3/3
- Dangling edge refs: 0/100
- Invalid enum values: 0
- Node/edge counts: 16/19, 23/43, 26/38 — unrenderable
- Semantic errors: read operations marked ONE_WAY; blocking SQL delete marked ASYNC

## v2 prompt (3 runs, same descriptions + 1 new)
- Valid JSON: 3/3
- Dangling edge refs: 0
- Invalid enum values: 0
- Node/edge counts: 11/15, 12/18, 12/17 — in band
- Semantic errors: none of the above recurred

## Conclusion
Schema is viable. Structural adherence was never the problem;
graph size and undefined enum semantics were. Both fixed in-prompt.

## Carried into design
- Renderer must handle APPLICATION → CLIENT back-edges (push notifications)
- Parser must strip markdown fences defensively — prompt instruction is not a guarantee
- Enum deserialization must be case-insensitive with OTHER fallback