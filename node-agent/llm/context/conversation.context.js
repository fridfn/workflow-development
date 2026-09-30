export function buildConversationContext({ llmContext }) {
  return {
    current: llmContext.current ?? null,

    memory: {
      shortTerm: llmContext.memory?.shortTerm ?? [],
    },
  };
}
