import { createLLMResponse } from "./llm.response.contract.js";

export function normalizeLLMResponse(output) {
  if (!output || typeof output !== "object") {
    throw new Error("LLM output is required.");
  }

  if (output.type === "action_intent") {
    return createLLMResponse({
      type: "action",
      action: output,
    });
  }

  if (typeof output.content === "string") {
    return createLLMResponse({
      type: "message",
      content: output.content,
    });
  }

  throw new Error("Unable to normalize LLM output.");
}