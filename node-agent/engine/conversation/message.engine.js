import { logInfo } from "../../utils/logger.js";
import { buildAgentContext } from "./context.builder.js";
import { retrieveRelevantMemory } from "./memory.retriever.js";
import { retrieveRelevantKnowledge } from "./knowledge.retriever.js";
import { loadShortTermMemory } from "./conversation.memory.js";
import {
  loadKnowledge,
  buildCorePersona,
  buildKnowledgeContext,
} from "./knowledge.context.js";

export async function handleMessage(event) {
  const { chatId, chatType } = event.context;

  const { messageId, text } = event.payload;

  const actor = event.actor;

  logInfo("CONVERSATION", "Message received", {
    chatId,
    chatType,
    messageId,
  });

  const conversation = {
    chat: {
      id: chatId,
      type: chatType,
    },

    actor: {
      id: actor?.id ?? null,
      name: actor?.name ?? null,
      username: actor?.username ?? null,
    },

    message: {
      id: messageId,
      text: text ?? "",
    },
  };

  const shortTerm = loadShortTermMemory();
  
  const relevantMemory = retrieveRelevantMemory({
    memories: shortTerm,
    query: text,
  });
  
  
  const persona = loadKnowledge("persona/aurielle.json");
  const identity = loadKnowledge("identity/farid.json");

  const relevantKnowledge = retrieveRelevantKnowledge({
    knowledge: {
      persona,
      identity,
    },
    query: text,
  });

  const corePersona = buildCorePersona(persona);

  const knowledge = buildKnowledgeContext({
    persona: corePersona,
    identity,
    relevant: relevantKnowledge,
  });

  const context = buildAgentContext({
    conversation,

    memory: {
      shortTerm: relevantMemory,
    },

    knowledge,
  });

  return {
    status: "processed",
    eventId: event.id,
    context
  };
}
