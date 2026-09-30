export function buildSystemContext({ persona = null }) {
  if (!persona) {
    return "";
  }

  return JSON.stringify(
    {
      identity: persona.identity ?? null,
      essence: persona.essence ?? null,
      personality: persona.personality ?? null,
      relationship: persona.relationship ?? null,
      communication: persona.communication ?? null,
      behavior: persona.behavior ?? null,
      values: persona.values ?? null,
      memory_behavior: persona.memory_behavior ?? null,
      boundaries: persona.boundaries ?? null,
      agent_instruction: persona.agent_instruction ?? null,
    },
    null,
    2,
  );
}
