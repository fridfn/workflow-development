import "dotenv/config";
import fs from "fs";
import { composeReply } from "./compose.js";
import { retryGenerate } from "./retry.js";
import { validateResult } from "../utils/validator.js";
import { hasCommitToday } from "../utils/github.js";
import { resolveDailyMode } from "../utils/time.js";
import {
  getMemory,
  setMemory,
  pushHistory,
  isInHistory
} from "../memory/memory.js";
import {
  logInfo,
  logWarn,
  logDebug,
  logSection
} from "../utils/logger.js";

logSection("ENGINE START");

const hasCommit = await hasCommitToday({
  username: "fridfn",
  token: process.env.GITHUB_TOKEN
});

const { mode, shouldSend, skip, hour } = resolveDailyMode({
  hasCommit
});

const MODE = mode;
const TAG = process.env.TAG;

logInfo("TIME", "Mode resolved from time", {
  MODE,
  hour
});

logInfo("ENGINE", "Node Agent Started");
logInfo("ENGINE", "Environment loaded", {
  MODE,
  TAG
});

const config = JSON.parse(fs.readFileSync("./config/agent.config.json"));

const agents = Object.keys(config);

logSection("LOAD CONFIG");

logInfo("CONFIG", "Loading config file...");
logInfo("CONFIG", "Agents detected", agents);

for (const agent of agents) {
  const seedGreet = Math.floor(Math.random() * 1000);
  const seedMsg = Math.floor(Math.random() * 1000);
  
  logSection(`AGENT → ${agent}`);
  
  logInfo(agent, "Start processing");
  
  logDebug(agent, "Seed generated", {
    seedGreet,
    seedMsg
  });

  let result = composeReply(
    config[agent],
    process.env.MODE,
    process.env.TAG,
    seedGreet,
    seedMsg
  );
  
  logDebug(agent, "Initial compose result", {
    reply: result.reply,
    meta: result.meta
  });
   
   const last = getMemory(`${agent}.last_message`);
   const lastGreeting = getMemory(`${agent}.last_greeting`);
   const lastTone = getMemory(`${agent}.last_tone`);
   
   logSection(`${agent} → MEMORY CHECK`);
   
   logDebug(agent, "Memory snapshot", {
     last,
     lastGreeting,
     lastTone
   });
   
   let finalResult = result;
   
   const validation = validateResult({
     result,
     last,
     lastGreeting,
     lastTone,
     isInHistory,
     agent
   });
   
   if (!validation.isValid) {
     logWarn(agent, "Initial rejected → retrying...", {
       reasons: validation.reasons
     });
     
     const retry = await retryGenerate({
      agent,
      config,
      mode: MODE,
      tag: TAG,
      composeReply,
      isDuplicate: (result) => {
          return !validateResult({
            result: result,
            last,
            lastGreeting,
            lastTone,
            isInHistory,
            agent
          }).isValid
        }
     });
     
     if (retry) {
       finalResult = retry;
       logInfo(agent, "Retry success ✔", {
         reply: retry.reply,
         meta: retry.meta
       });
     } else {
       logWarn(agent, "Retry failed → skip");
       continue
     }
   }
   
   logSection(`${agent} → FINAL OUTPUT`);
   logInfo(agent, "Reply ready");
   logDebug(agent, "Final payload", {
     reply: finalResult.reply
   });
   
  setMemory(`${agent}.last_message`, finalResult.reply);
  pushHistory(`${agent}.history`, finalResult.reply, 5);
  
  logDebug(agent, "Validation result / Decision source", validation);
  logInfo(agent, "Saving memory...");
  logDebug(agent, "Saved state", {
    last_message: finalResult.reply
  });

  console.log("REPLY:\n", finalResult.reply);
}


logSection("ENGINE DONE");
logInfo("ENGINE", "All agents processed 💜");


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