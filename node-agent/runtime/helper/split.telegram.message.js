const TELEGRAM_MESSAGE_LIMIT = 4000;

function splitByLength(text, limit) {
  const chunks = [];
  let remaining = text.trim();

  while (remaining.length > limit) {
    let splitIndex = remaining.lastIndexOf(" ", limit);

    if (splitIndex <= 0) {
      splitIndex = limit;
    }

    chunks.push(remaining.slice(0, splitIndex).trim());
    remaining = remaining.slice(splitIndex).trim();
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
}

function splitSentence(sentence, limit) {
  if (sentence.length <= limit) {
    return [sentence.trim()];
  }

  return splitByLength(sentence, limit);
}

function splitParagraph(paragraph, limit) {
  if (paragraph.length <= limit) {
    return [paragraph.trim()];
  }

  const sentences = paragraph.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];

  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    const cleanSentence = sentence.trim();

    if (!cleanSentence) continue;

    if (cleanSentence.length > limit) {
      if (current) {
        chunks.push(current.trim());
        current = "";
      }

      chunks.push(...splitSentence(cleanSentence, limit));
      continue;
    }

    const candidate = current ? `${current} ${cleanSentence}` : cleanSentence;

    if (candidate.length <= limit) {
      current = candidate;
    } else {
      if (current) {
        chunks.push(current.trim());
      }

      current = cleanSentence;
    }
  }

  if (current) {
    chunks.push(current.trim());
  }

  return chunks;
}

export function splitTelegramMessage(text, limit = TELEGRAM_MESSAGE_LIMIT) {
  if (typeof text !== "string") {
    throw new Error("Telegram message text must be a string.");
  }

  const normalizedText = text.trim();

  if (!normalizedText) {
    return [];
  }

  if (normalizedText.length <= limit) {
    return [normalizedText];
  }

  const paragraphs = normalizedText
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const paragraphChunks = splitParagraph(paragraph, limit);

    for (const paragraphChunk of paragraphChunks) {
      const candidate = current
        ? `${current}\n\n${paragraphChunk}`
        : paragraphChunk;

      if (candidate.length <= limit) {
        current = candidate;
      } else {
        if (current) {
          chunks.push(current.trim());
        }

        current = paragraphChunk;
      }
    }
  }

  if (current) {
    chunks.push(current.trim());
  }

  return chunks;
}
