export function buildLLMRequest({
  type,
  systemContext,
  model,
  prompt,
  temperature,
  max_tokens,
}) {
  return {
    type,
    model,
    system: systemContext,
    prompt,
    temperature,
    max_tokens,
  };
}
