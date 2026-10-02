import { logInfo } from "../../utils/logger.js";
import { buildAgentContext } from "./context.builder.js";
import { retrieveRelevantMemory } from "./memory.retriever.js";
import { buildKnowledgeContext } from "./knowledge.context.js";
import { loadShortTermMemory } from "./conversation.memory.js";

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

  const knowledge = buildKnowledgeContext();

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
