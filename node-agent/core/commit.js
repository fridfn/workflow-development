import fs from "fs";
import "dotenv/config";
import { composeReply } from "./compose.js";
import { resolveDailyMode } from "../utils/time.js";
import { hasCommitToday } from "../utils/github.js";
import {
  logInfo,
  logWarn,
  logDebug,
  logSection
} from "../utils/logger.js";

// =========================
// 🔹 LOAD CONFIG
// =========================
const config = JSON.parse(
  fs.readFileSync("./config/agent.config.json")
);

const agent = config["aurielle_nara_elowen"];

// =========================
// 🔹 PARSE COMMIT
// =========================
function parseCommit(msg) {
  let type = "update";
  let detail = msg;

  if (msg.includes(":")) {
    const [t, ...rest] = msg.split(":");
    type = t.trim();
    detail = rest.join(":").trim();
  }

  let reaction = "update";

  if (type.startsWith("feat")) reaction = "feat";
  else if (type.startsWith("fix")) reaction = "fix";
  else if (type.startsWith("refactor")) reaction = "refactor";
  else if (type.startsWith("chore")) reaction = "chore";
  else if (type.startsWith("docs")) reaction = "docs";
  else if (type.startsWith("style")) reaction = "style";
  else if (type.startsWith("test")) reaction = "test";

  return { type, detail, reaction };
}

// =========================
// 🔹 MAIN EXECUTION
// =========================
logSection("COMMIT PARSER");const msg =
  process.env.COMMIT_MESSAGE ||
  "feat: migrate bash parser to nodejs";

logInfo("COMMIT", "Raw commit message", {
  msg
});

const parsed = parseCommit(msg);

logDebug("COMMIT", "Parsed result", parsed);

const hasCommit = await hasCommitToday({
  username: "fridfn",
  token: process.env.GITHUB_TOKEN
});

const { mode, hour, source } = resolveDailyMode({
  hasCommit
});
logInfo("TIME", "Resolved mode", {
  mode,
  hour,
  source
});

// =========================
// 🔹 GENERATE REPLY
// =========================
const seedGreet = Math.floor(Math.random() * 1000);
const seedMsg = Math.floor(Math.random() * 1000);

const result = composeReply(
  agent,
  mode,
  parsed.reaction,
  seedGreet,
  seedMsg
);

logSection("FINAL RESULT");

logInfo("REPLY", "Generated reply", {
  reply: result.reply
});

logInfo("\n💜 FINAL REPLY:\n");
logInfo(result.reply);