export function retrieveRelevantMemory({
  memories = [],
  query = "",
  limit = 5,
}) {
  if (!query.trim()) {
    return [];
  }

  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);

  const scored = memories.map((memory) => {
    const messageText = memory.content?.message?.text?.toLowerCase() ?? "";
    const assistantText = memory.content?.assistant?.text?.toLowerCase() ?? "";

    const text = `${messageText} ${assistantText}`;

    let score = 0;

    for (const word of queryWords) {
      if (text.includes(word)) {
        score++;
      }
    }

    return {
      memory,
      score,
    };
  });

  console.log("\n========== MEMORY RETRIEVAL AUDIT ==========");

  for (const item of scored) {
    const text = JSON.stringify(item.memory);

    console.log({
      score: item.score,
      id: item.memory.id,
      estimatedTokens: Math.ceil(text.length / 4),
    });
  }

  console.log("============================================\n");

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.memory);
}
