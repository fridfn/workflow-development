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
    const text = memory.content?.message?.text?.toLowerCase() ?? "";

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

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.memory);
}
