export function createLLMActionOutput({ intent, version = 1 }) {
  return {
    type: "action_intent",
    version,
    intent,
  };
}
