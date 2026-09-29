import { buildKnowledgeContext } from "../../../engine/conversation/knowledge.context.js";

const knowledge = buildKnowledgeContext();

console.log("\nKNOWLEDGE CONTEXT:");
console.dir(knowledge, {
  depth: null,
});
