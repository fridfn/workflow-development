export function validateLLMActionOutput(output) {
  if (!output || typeof output !== "object") {
    throw new Error("LLM action output must be an object.");
  }

  if (output.type !== "action_intent") {
    throw new Error("LLM output type must be 'action_intent'.");
  }

  if (!output.version) {
    throw new Error("LLM output version is required.");
  }

  if (!output.intent || typeof output.intent !== "object") {
    throw new Error("LLM action intent is required.");
  }

  if (!output.intent.type) {
    throw new Error("LLM action intent type is required.");
  }

  if (!output.intent.payload || typeof output.intent.payload !== "object") {
    throw new Error("LLM action intent payload is required.");
  }

  return true;
}
