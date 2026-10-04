export function buildConversationContext({ llmContext }) {
  return {
    current: llmContext.current ?? null,
    relevant: llmContext.knowledge.relevant ?? [],

    memory: {
      shortTerm: llmContext.memory?.shortTerm ?? [],
    },
  };
}
