export function buildAgentContext({
  conversation,
  memory = {},
  knowledge = {},
}) {
  return {
    current: {
      conversation,
    },

    memory: {
      shortTerm: memory.shortTerm ?? [],
      longTerm: memory.longTerm ?? [],
      relationship: memory.relationship ?? [],
    },

    knowledge: {
      persona: knowledge.persona ?? null,
      identity: knowledge.identity ?? null,
      relevant: knowledge.relevant ?? [],
    },
  };
}
