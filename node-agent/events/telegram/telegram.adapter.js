import { createEvent } from "../../core/event/event.contract.js";

export function createTelegramMessageEvent(update) {
  const message = update.message;

  return createEvent({
    source: {
      type: "telegram",
      id: String(message?.chat?.id ?? "unknown"),
    },

    event: {
      category: "conversation",
      type: "message",
    },

    actor: {
      id: String(message?.from?.id ?? "unknown"),
      name: message?.from?.first_name ?? null,
      username: message?.from?.username ?? null,
    },

    context: {
      chatId: String(message?.chat?.id ?? "unknown"),
      chatType: message?.chat?.type ?? null,
    },

    payload: {
      messageId: message?.message_id ?? null,
      text: message?.text ?? "",
    },

    metadata: {
      provider: "telegram",
    },
  });
}
