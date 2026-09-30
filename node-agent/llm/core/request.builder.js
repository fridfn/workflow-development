export function buildLLMRequest({
  type,
  systemContext,
  conversationContext,
  model,
  temperature,
  max_tokens,
}) {
  return {
    type,

    model,

    system: systemContext,

    prompt: conversationContext,

    temperature,
    max_tokens,
  };
}
