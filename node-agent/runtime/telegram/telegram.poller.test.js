import { pollTelegram, acknowledgeTelegram } from "./telegram.poller.js";

const result = await pollTelegram();

console.log("\nTELEGRAM POLLER RESULT:\n");
console.dir(result, { depth: null });
