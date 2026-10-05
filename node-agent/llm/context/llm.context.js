function estimateTokens(text) {
  if (typeof text !== "string") {
    text = JSON.stringify(text);
  }

  return Math.ceil(text.length / 4);
}

export function buildLLMContext({ agentContext }) {
  const context = {
    persona: agentContext.knowledge?.persona ?? null,

    knowledge: {
      relevant: agentContext.knowledge?.relevant ?? [],
    },

    current: agentContext.current?.conversation ?? null,

    memory: {
      shortTerm: agentContext.memory?.shortTerm ?? [],
      longTerm: agentContext.memory?.longTerm ?? [],
      relationship: agentContext.memory?.relationship ?? [],
    },
  };

  console.log("\n========== LLM CONTEXT AUDIT ==========");

  console.log(
    "Persona:",
    estimateTokens(JSON.stringify(context.persona)),
    "tokens",
  );

  console.log(
    "Knowledge:",
    estimateTokens(JSON.stringify(context.knowledge)),
    "tokens",
  );

  console.log(
    "Current:",
    estimateTokens(JSON.stringify(context.current)),
    "tokens",
  );

  console.log(
    "Short-term:",
    estimateTokens(JSON.stringify(context.memory.shortTerm)),
    "tokens",
  );

  console.log(
    "Long-term:",
    estimateTokens(JSON.stringify(context.memory.longTerm)),
    "tokens",
  );

  console.log(
    "Relationship:",
    estimateTokens(JSON.stringify(context.memory.relationship)),
    "tokens",
  );

  console.log("========================================\n");

  return context;
}
