export function buildLLMContext({ agentContext }) {
  return {
    persona: agentContext.knowledge?.persona ?? null,

    identity: agentContext.knowledge?.identity ?? null,

    current: agentContext.current?.conversation ?? null,

    memory: {
      shortTerm: agentContext.memory?.shortTerm ?? [],

      longTerm: agentContext.memory?.longTerm ?? [],

      relationship: agentContext.memory?.relationship ?? [],
    },
  };
}
