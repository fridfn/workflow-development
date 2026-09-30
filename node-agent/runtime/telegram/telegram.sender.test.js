import { sendTelegramMessage } from "./telegram.sender.js";

const result = await sendTelegramMessage({
  chatId: "5004824900",
  text: "🌙 Telegram sender test berhasil.",
});

console.log("\nTELEGRAM SENDER RESULT:\n");
console.dir(result, { depth: null });
