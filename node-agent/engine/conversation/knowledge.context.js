import fs from "fs";
import path from "path";

const KNOWLEDGE_DIR = path.resolve("knowledge");

export function loadKnowledge(filePath) {
  const filepath = path.join(KNOWLEDGE_DIR, filePath);

  if (!fs.existsSync(filepath)) {
    return null;
  }

  const content = fs.readFileSync(filepath, "utf-8");

  return JSON.parse(content);
}

export function buildKnowledgeContext() {
  const persona = loadKnowledge("persona/aurielle.json");

  const identity = loadKnowledge("identity/farid.json");

  return {
    persona,
    identity,
  };
}