import { buildKnowledgeContext } from "../knowledge.context.js";

const knowledge = buildKnowledgeContext();

console.log("\nKNOWLEDGE CONTEXT:\n");
console.dir(knowledge, { depth: null });

console.log("\nPERSONA:\n");
console.dir(knowledge.persona, { depth: null });

console.log("\nIDENTITY:\n");
console.dir(knowledge.identity, { depth: null });


//node --env-file=.env engine/conversation/playground/knowledge.context.test.js