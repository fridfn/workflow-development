export function createTelegramSendMessageHandler(sendMessage) {
  if (typeof sendMessage !== "function") {
    throw new Error("sendMessage executor must be a function.");
  }

  return async function handleTelegramSendMessage(action) {
    if (!action || typeof action !== "object") {
      throw new Error("Action is required.");
    }

    const { chatId, text } = action.payload ?? {};

    if (!chatId) {
      throw new Error("Telegram chatId is required.");
    }

    if (!text) {
      throw new Error("Telegram text is required.");
    }

    return await sendMessage({
      chatId,
      text,
    });
  };
}
