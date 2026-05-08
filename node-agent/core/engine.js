import "dotenv/config";

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
  logSection,
  logInfo
} from "../utils/logger.js";

logSection("ENGINE START");

const hasCommit = await hasCommitToday({
  username: "fridfn",
  token: process.env.GITHUB_TOKEN
});

const {
  mode,
  hour
} = resolveDailyMode({
  hasCommit
});

logInfo("TIME", "Mode resolved", {
  mode,
  hour
});

await runEngine({
  source: "scheduler",
  mode,
  tag: process.env.TAG || "default"
});

logSection("ENGINE DONE");