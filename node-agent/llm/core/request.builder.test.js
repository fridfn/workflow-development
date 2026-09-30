import { buildLLMRequest } from "./request.builder.js";

const request = buildLLMRequest({
  type: "conversation",

  systemContext: "You are Aurielle.",

  prompt: `
Current conversation:
{
  "text": "Halo Aurielle"
}

Relevant short-term memory:
[]
`,

  model: "qwen/qwen3.8-27b",
  temperature: 0.8,
  max_tokens: 1000,
});

console.log("\nLLM REQUEST:\n");

console.dir(request, { depth: null });
