export function retrieveRelevantKnowledge({
  knowledge = {},
  query = "",
  limit = 5,
}) {
  if (!query.trim()) {
    return [];
  }

  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);

  const candidates = flattenKnowledge(knowledge);

  const scored = candidates.map((item) => {
    const searchableText = [item.path, JSON.stringify(item.content)]
      .join(" ")
      .toLowerCase();

    let score = 0;

    for (const word of queryWords) {
      if (searchableText.includes(word)) {
        score++;
      }
    }

    return {
      ...item,
      score,
    };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ source, path, content }) => ({
      source,
      path,
      content,
    }));
}

function flattenKnowledge(knowledge) {
  const results = [];

  for (const [source, value] of Object.entries(knowledge)) {
    walkKnowledge(value, {
      source,
      path: "",
      results,
    });
  }

  return results;
}

function walkKnowledge(value, { source, path, results }) {
  if (value === null || value === undefined) {
    return;
  }

  if (typeof value !== "object") {
    if (path) {
      results.push({
        source,
        path,
        content: value,
      });
    }

    return;
  }

  for (const [key, child] of Object.entries(value)) {
    const childPath = path ? `${path}.${key}` : key;

    if (child !== null && typeof child === "object") {
      walkKnowledge(child, {
        source,
        path: childPath,
        results,
      });
    } else {
      results.push({
        source,
        path: childPath,
        content: child,
      });
    }
  }
}
