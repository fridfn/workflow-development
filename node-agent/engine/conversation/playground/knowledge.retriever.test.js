import { buildKnowledgeContext } from "../knowledge.context.js";
import { retrieveRelevantKnowledge } from "../knowledge.retriever.js";

const knowledge = buildKnowledgeContext();

const query = "OpenStick AI agent memory";

const relevantKnowledge = retrieveRelevantKnowledge({
  knowledge,
  query,
  limit: 5,
});

console.log("\nQUERY:\n");
console.log(query);

console.log("\nRELEVANT KNOWLEDGE:\n");
console.dir(relevantKnowledge, {
  depth: null,
});

console.log("\nRESULT COUNT:\n");
console.log(relevantKnowledge.length);


//node --env-file=.env engine/conversation/playground/knowledge.retriever.test.js