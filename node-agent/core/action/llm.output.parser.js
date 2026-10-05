export function parseLLMOutput(content) {
  if (typeof content !== "string") {
    throw new Error("LLM output content must be a string.");
  }

  const trimmed = content.trim();

  if (!trimmed) {
    throw new Error("LLM output content is empty.");
  }

  // Coba membaca structured JSON
  try {
    const parsed = JSON.parse(trimmed);

    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    // Bukan JSON → anggap sebagai plain message
  }

  // Plain LLM response
  return {
    content: trimmed,
  };
}
