export async function sendTelegramMessage({ chatId, text }) {
  const token = process.env.TELEGRAM_TOKEN_AURIELLE;

  if (!token) {
    throw new Error("TELEGRAM_TOKEN_AURIELLE is missing.");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    },
  );

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`Telegram API error: ${result.description}`);
  }

  return result;
}
