import { loadShortTermMemory } from "../conversation.memory.js";
import { retrieveRelevantMemory } from "../memory.retriever.js";

const memories = loadShortTermMemory();

console.log("\nSHORT-TERM MEMORY:\n");
console.dir(memories, { depth: null });

const query = "malem aurielle";

const relevantMemory = retrieveRelevantMemory({
  memories,
  query,
  limit: 5,
});

console.log("\nQUERY:\n");
console.log(query);

console.log("\nRELEVANT MEMORY:\n");
console.dir(relevantMemory, { depth: null });

console.log("\nRESULT COUNT:\n");
console.log(relevantMemory.length);
