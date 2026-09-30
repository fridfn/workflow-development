import { buildKnowledgeContext } from "../../../engine/conversation/knowledge.context.js";
import { buildSystemContext } from "../../../llm/context/system.context.js";

const knowledge = buildKnowledgeContext();

const systemContext = buildSystemContext({
  persona: knowledge.persona,
});

console.log("\nSYSTEM CONTEXT:\n");
console.log(systemContext);
