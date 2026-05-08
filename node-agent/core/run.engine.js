import fs from "fs";
import { composeReply } from "./compose.js";
import { retryGenerate } from "./retry.js";

import { validateResult } from "../utils/validator.js";

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

export async function runEngine({
  source = "system",
  mode,
  tag,
  context = {}
}) {

  logSection(`ENGINE RUN → ${source}`);

  // =========================
  // 🔹 LOAD CONFIG
  // =========================
  const config = JSON.parse(
    fs.readFileSync("./config/agent.config.json")
  );

  const agents = Object.keys(config);

  logInfo("ENGINE", "Agents loaded", agents);

  // =========================
  // 🔹 LOOP AGENTS
  // =========================
  for (const agent of agents) {

    logSection(`AGENT → ${agent}`);

    const seedGreet = Math.floor(Math.random() * 1000);
    const seedMsg = Math.floor(Math.random() * 1000);

    logDebug(agent, "Seed generated", {
      seedGreet,
      seedMsg
    });

    // =========================
    // 🔹 COMPOSE
    // =========================
    let result = composeReply(
      config[agent],
      mode,
      tag,
      seedGreet,
      seedMsg
    );

    logDebug(agent, "Initial compose", {
      reply: result.reply,
      meta: result.meta
    });

    // =========================
    // 🔹 MEMORY
    // =========================
    const last = getMemory(`${agent}.last_message`);
    const lastGreeting = getMemory(`${agent}.last_greeting`);
    const lastTone = getMemory(`${agent}.last_tone`);

    const validation = validateResult({
      result,
      last,
      lastGreeting,
      lastTone,
      isInHistory,
      agent
    });

    let finalResult = result;

    // =========================
    // 🔹 RETRY
    // =========================
    if (!validation.isValid) {

      logWarn(agent, "Rejected → retrying...", {
        reasons: validation.reasons
      });

      const retry = await retryGenerate({
        agent,
        config,
        mode,
        tag,
        composeReply,
        isDuplicate: (result) => {
          return !validateResult({
            result,
            last,
            lastGreeting,
            lastTone,
            isInHistory,
            agent
          }).isValid;
        }
      });

      if (retry) {

        finalResult = retry;

        logInfo(agent, "Retry success ✔", {
          reply: retry.reply
        });

      } else {

        logWarn(agent, "Retry failed → skip");

        continue;
      }
    }

    // =========================
    // 🔹 FINAL PAYLOAD
    // =========================
    const payload = {
      source,

      reply: finalResult.reply,

      meta: finalResult.meta,

      context: {
        mode,
        tag
      },

      extra: context,

      created_at: Date.now()
    };

    // =========================
    // 🔹 SAVE MEMORY
    // =========================
    setMemory(`${agent}.last_message`, payload.reply);
    setMemory(`${agent}.last_tone`, payload.meta.tone);
    setMemory(`${agent}.last_greeting`, payload.meta.greeting);

    pushHistory(
      `${agent}.history`,
      payload,
      10
    );

    // =========================
    // 🔹 STATS
    // =========================
    const stats =
      getMemory(`${agent}.stats`) || {};

    stats.total_generated =
      (stats.total_generated || 0) + 1;

    stats.last_generated_at = Date.now();

    setMemory(`${agent}.stats`, stats);

    // =========================
    // 🔹 COMMIT MEMORY
    // =========================
    if (source === "commit") {

      const commitStats =
        getMemory(`${agent}.commit.stats`) || {};

      const type =
        context.commit?.type || "unknown";

      commitStats[type] =
        (commitStats[type] || 0) + 1;

      setMemory(
        `${agent}.commit.last`,
        context.commit
      );

      setMemory(
        `${agent}.commit.stats`,
        commitStats
      );

      pushHistory(
        `${agent}.commit.history`,
        {
          ...context.commit,
          mode,
          reply: payload.reply,
          created_at: Date.now()
        },
        20
      );
    }

    // =========================
    // 🔹 OUTPUT
    // =========================
    logSection(`${agent} → FINAL`);

    logInfo(agent, "Reply ready");

    logDebug(agent, "Payload", payload);

    console.log("\n💜 FINAL REPLY:\n");
    console.log(payload.reply);
  }
}