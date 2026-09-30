import { buildKnowledgeContext } from "../../engine/conversation/knowledge.context.js";
import { buildAgentContext } from "../../engine/conversation/context.builder.js";
import { generateConversationResponse } from "./conversation.task.js";

const conversation = {
  chat: {
    id: "test-chat",
    type: "private",
  },

  actor: {
    id: "test-user",
    name: "Farid",
    username: "fridfn",
  },

  message: {
    id: 1,
    text: "Halo Aurielle, ini test conversation task.",
  },
};

const knowledge = buildKnowledgeContext();

const agentContext = buildAgentContext({
  conversation,
  memory: {
    shortTerm: [],
  },
  knowledge,
});

const response = await generateConversationResponse({
  agentContext,
});

console.log("\nCONVERSATION RESPONSE:\n");
console.log(response);
