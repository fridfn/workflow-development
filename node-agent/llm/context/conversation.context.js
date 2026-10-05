export function buildConversationContext({ llmContext }) {
  return {
    current: llmContext.current ?? null,
    relevant: llmContext.knowledge.relevant ?? [],

    memory: {
      shortTerm: (llmContext.memory?.shortTerm ?? []).map((memory) => ({
        message: memory.content?.message?.text ?? "",
        assistant: memory.content?.assistant?.text ?? "",
      })),
    },
  };
}
