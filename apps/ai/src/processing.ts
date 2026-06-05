import { getDesignById, updateDesignById } from "@archiq/db";
import { setStatus } from "@archiq/cache";
import Anthropic from "@anthropic-ai/sdk";
import { DiagramBody } from "@archiq/types";

let client: Anthropic | null = null;

const SYSTEM_PROMPT = `You are an architecture diagram generator.
Given a description, return a JSON object with exactly this shape:
{
  "mermaid": "graph TD\\n  A[Client] --> B[API]\\n  B --> C[(Database)]",
  "nodes": [
    { "id": "A", "label": "Client", "type": "client" },
    { "id": "B", "label": "API", "type": "service" },
    { "id": "C", "label": "Database", "type": "database" }
  ],
  "edges": [
    { "from": "A", "to": "B", "label": "HTTP" },
    { "from": "B", "to": "C" }
  ]
}
Node types must be one of: service, database, queue, cache, external, client.
Return ONLY the JSON. No explanation, no markdown fences, no extra keys.`;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    client = new Anthropic({ apiKey });
  }
  return client;
}

export async function processDesign(jobId: string) {
  const design = await getDesignById(jobId);
  if (!design) throw new Error(`Design ${jobId} not found`);

  await updateDesignById(jobId, { status: "PROCESSING" });
  await setStatus(jobId, "PROCESSING");

  const response = await getClient().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048, // bumped — JSON response is larger than raw Mermaid
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: design.prompt }],
  });

  const raw = response.content[0];
  if (!raw || raw.type !== "text") throw new Error("Unexpected response type");

  const diagram = parseDiagram(raw.text);

  await updateDesignById(jobId, { status: "READY", body: diagram });
  await setStatus(jobId, "READY");
}

function parseDiagram(raw: string): DiagramBody {
  const cleaned = raw
    .replace(/^```[a-z]*\r?\n?/i, "")
    .replace(/\r?\n?```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`LLM returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }

  // validate shape
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as any).mermaid !== "string" ||
    !Array.isArray((parsed as any).nodes) ||
    !Array.isArray((parsed as any).edges)
  ) {
    throw new Error("LLM response missing required fields");
  }

  return parsed as DiagramBody;
}
