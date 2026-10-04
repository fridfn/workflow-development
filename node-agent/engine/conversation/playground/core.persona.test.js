import { loadKnowledge, buildCorePersona } from "../knowledge.context.js";

const persona = loadKnowledge("persona/aurielle.json");

const corePersona = buildCorePersona(persona);

console.log("\nCORE PERSONA:\n");
console.dir(corePersona, { depth: null });



//node --env-file=.env engine/conversation/playground/core.persona.test.js