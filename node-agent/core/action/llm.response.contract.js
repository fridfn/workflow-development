export function createLLMResponse({
  type = "message",
  content = null,
  action = null,
  version = 1,
}) {
  return {
    type,
    version,
    content,
    action,
  };
}
