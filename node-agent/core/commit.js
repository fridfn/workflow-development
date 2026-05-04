import { resolveDailyMode } from "../utils/time.js";
import { hasCommitToday } from "../utils/github.js";
import {
  logInfo,
  logWarn,
  logDebug,
  logSection
} from "../utils/logger.js";

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
const msg = process.env.COMMIT_MESSAGE || "";

console.log("[COMMIT] Raw message:", msg);

const parsed = parseCommit(msg);

const hasCommit = await hasCommitToday({
  username: "fridfn",
  token: process.env.GITHUB_TOKEN
});

const { mode } = resolveDailyMode({
  hasCommit
});

const weights = {
  "message,greeting": 20,
  "greeting": 40,
  "message": 40
};

// =========================
// 🔹 OUTPUT KE GITHUB ACTION
// =========================
function setOutput(key, value) {
  console.log(`${key}=${value}`);
  process.stdout.write(`${key}=${value}\n`);
}

setOutput("type", parsed.type);
setOutput("detail", parsed.detail);
setOutput("reaction", parsed.reaction);
setOutput("mode", mode);
setOutput("compose_weights", JSON.stringify(weights));