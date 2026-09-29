import fs from "fs";
import path from "path";

const MEMORY_DIR = path.resolve("knowledge/memory/short-term");

export function saveConversation(conversation) {
  fs.mkdirSync(MEMORY_DIR, {
    recursive: true,
  });

  const timestamp = new Date().toISOString();

  const memory = {
    id: crypto.randomUUID(),
    type: "conversation",
    content: conversation,
    createdAt: timestamp,
    updatedAt: timestamp,
    source: "telegram",
  };

  const filename = `${memory.id}.json`;

  const filepath = path.join(MEMORY_DIR, filename);

  fs.writeFileSync(filepath, JSON.stringify(memory, null, 2), "utf-8");

  return memory;
}

export function loadShortTermMemory(limit = 10) {
  if (!fs.existsSync(MEMORY_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(MEMORY_DIR)
    .filter((file) => file.endsWith(".json"));

  const memories = files.map((file) => {
    const filepath = path.join(MEMORY_DIR, file);

    const content = fs.readFileSync(filepath, "utf-8");

    return JSON.parse(content);
  });

  memories.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return memories.slice(-limit);
}
