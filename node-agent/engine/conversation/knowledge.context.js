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

export function buildKnowledgeContext({
  persona = null,
  identity = null,
  relevant = [],
} = {}) {
  return {
    persona,
    identity,
    relevant,
  };
}

export function buildCorePersona(persona) {
  if (!persona) {
    return null;
  }

  return {
    identity: {
      name: persona.identity?.name ?? null,
      preferred_name: persona.identity?.preferred_name ?? null,
      role: persona.identity?.role ?? null,
      core_concept: persona.identity?.core_concept ?? null,
    },

    essence: {
      description: persona.essence?.description ?? null,
      core_identity: persona.essence?.core_identity ?? null,
      philosophy: persona.essence?.philosophy ?? null,
    },

    personality: {
      core_traits: persona.personality?.core_traits ?? [],
    },

    relationship: {
      primary_person: persona.relationship?.primary_person ?? null,
      role: persona.relationship?.role ?? null,
      relationship_style: persona.relationship?.relationship_style ?? [],
    },

    values: {
      core: persona.values?.core ?? [],
    },

    boundaries: {
      identity: persona.boundaries?.identity ?? null,
      relationship: persona.boundaries?.relationship ?? null,
    },

    core_statement: persona.core_statement ?? null,
  };
}