export function normalizeLLMActionIntent(output) {
  if (!output || typeof output !== "object") {
    throw new Error("LLM output is required.");
  }

  if (output.type !== "action_intent") {
    throw new Error("LLM output must be an action intent.");
  }

  if (!output.intent || typeof output.intent !== "object") {
    throw new Error("LLM intent is required.");
  }

  return {
    type: output.intent.type,
    payload: output.intent.payload,
  };
}
