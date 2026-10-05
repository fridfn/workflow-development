export function validateLLMResponse(response) {
  if (!response || typeof response !== "object") {
    throw new Error("LLM response must be an object.");
  }

  if (!response.type) {
    throw new Error("LLM response type is required.");
  }

  if (!["message", "action"].includes(response.type)) {
    throw new Error(`Unknown LLM response type: ${response.type}`);
  }

  if (!response.version) {
    throw new Error("LLM response version is required.");
  }

  if (response.type === "message") {
    if (typeof response.content !== "string") {
      throw new Error("LLM message content must be a string.");
    }
  }

  if (response.type === "action") {
    if (!response.action || typeof response.action !== "object") {
      throw new Error("LLM action response must contain an action.");
    }
  }

  return true;
}
