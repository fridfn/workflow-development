import "dotenv/config";

import {
  parseCommit
} from "../utils/parser.js";

import {
  resolveDailyMode
} from "../utils/time.js";

import {
  hasCommitToday
} from "../utils/github.js";

import {
  runEngine
} from "./run.engine.js";

import {
  logInfo,
  logSection
} from "../utils/logger.js";

import { getRandomCommit } from "../utils/random.commit.js"

logSection("COMMIT FLOW");

const msg = getRandomCommit() ||
  process.env.COMMIT_MESSAGE ||
  "feat: migrate parser";

logInfo("COMMIT", "Raw message", {
  msg
});

// =========================
// 🔹 PARSE
// =========================
const parsed = parseCommit(msg);

logInfo("COMMIT", "Parsed", parsed);

// =========================
// 🔹 CHECK ACTIVITY
// =========================
const hasCommit = await hasCommitToday({
  username: "fridfn",
  token: process.env.GITHUB_TOKEN
});

// =========================
// 🔹 MODE
// =========================
const {
  mode,
  hour
} = resolveDailyMode({
  hasCommit
});

logInfo("TIME", "Resolved mode", {
  mode,
  hour
});

// =========================
// 🔹 RUN ENGINE
// =========================
await runEngine({

  source: "commit",

  mode,

  tag: parsed.reaction,

  context: {
    commit: parsed
  }
});

logSection("COMMIT DONE");