import { getDesignById, updateDesignById } from "@archiq/db";
import { publish, setStatus } from "@archiq/cache";
import Anthropic from "@anthropic-ai/sdk";
import { DiagramBody } from "@archiq/types";
import { SYSTEM_PROMPT } from "./systemPrompt.js";

let client: Anthropic | null = null;

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
    max_tokens: 2048,
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
  await publish(`design:${jobId}`, diagram);
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
    !Array.isArray((parsed as any).nodes) ||
    !Array.isArray((parsed as any).edges)
  ) {
    throw new Error("LLM response missing required fields");
  }

  return parsed as DiagramBody;
}
