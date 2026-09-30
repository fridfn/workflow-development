import fs from "fs";

const OFFSET_FILE = "./telegram.offset";

function loadOffset() {
  if (!fs.existsSync(OFFSET_FILE)) {
    return 0;
  }

  const value = fs.readFileSync(OFFSET_FILE, "utf-8").trim();

  return Number(value) || 0;
}

function saveOffset(offset) {
  fs.writeFileSync(OFFSET_FILE, String(offset), "utf-8");
}

async function getTelegramUpdates(offset = 0) {
  const token = process.env.TELEGRAM_TOKEN_AURIELLE;

  if (!token) {
    throw new Error("TELEGRAM_TOKEN_AURIELLE is missing.");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}`,
  );

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`Telegram API error: ${result.description}`);
  }

  return result.result;
}

export async function pollTelegram() {
  const offset = loadOffset();

  const updates = await getTelegramUpdates(offset);

  if (updates.length === 0) {
    return {
      updates: [],
      nextOffset: offset,
    };
  }

  const nextOffset = updates.at(-1).update_id + 1;

  return {
    updates,
    nextOffset,
  };
}

export function acknowledgeTelegram(nextOffset) {
  saveOffset(nextOffset);
}
