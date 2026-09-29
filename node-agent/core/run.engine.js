import fs from "fs";

import { retryGenerate } from "./retry.js";
import { sleep } from "../utils/delay.js";
import { composeReply } from "./compose.js";
import { validateResult } from "../utils/validator.js";
import { archiveMemory } from "../memory/archive.js";
import { weightedRandom } from "../utils/random/weighted.js";
import { weightedDelay } from "../utils/random/weighted.delay.js";
import { buildStoryLayer } from "../engine/enrichment/story.mapper.js";
import { getMemory, setMemory, isInHistory } from "../memory/memory.js";
import { logInfo, logWarn, logDebug, logSection } from "../utils/logger.js";

import {
  updateAgentStats,
  generateMonthSummary,
} from "../utils/stats/index.js";

export async function runEngine({
  source = "system",
  mode,
  tag,
  context = {},
}) {
  const config = JSON.parse(fs.readFileSync("./config/agent.config.json"));

  const agents = Object.keys(config);

  for (const agent of agents) {
    logSection(`AGENT → ${agent}`);
    const seedGreet = Math.floor(Math.random() * 1000);
    const seedMsg = Math.floor(Math.random() * 1000);

    const composeOverride = weightedRandom({
      "message,greeting": 20,
      greeting: 40,
      message: 40,
    });

    const delay = weightedDelay(20, config[agent].delay);

    let result = composeReply(
      config[agent],
      mode,
      tag,
      seedGreet,
      seedMsg,
      composeOverride,
    );

    const last = getMemory(agent, "last_message");
    const lastGreeting = getMemory(agent, "last_greeting");
    const lastTone = getMemory(agent, "last_tone");
    let validation = validateResult({
      result,
      last,
      lastGreeting,
      lastTone,
      isInHistory,
      agent,
    });

    logInfo("AGENT", "Weighted compose selected", {
      agent,
      composeOverride,
    });

    logInfo("AGENT", "Weighted delay calculated", {
      agent,
      delay,
    });

    let finalResult = result;

    if (!validation.isValid) {
      logWarn(agent, "Rejected → retrying...", {
        reasons: validation.reasons,
      });

      const retry = await retryGenerate({
        agent,
        config,
        mode,
        tag,
        composeReply,
        override: composeOverride,

        isDuplicate: (result) => {
          return !validateResult({
            result,
            last,
            lastGreeting,
            lastTone,
            isInHistory,
            agent,
          }).isValid;
        },
      });

      if (retry) {
        finalResult = retry;

        validation = validateResult({
          result: finalResult,
          last,
          lastGreeting,
          lastTone,
          isInHistory,
          agent,
        });

        logInfo(agent, "Retry success ✔", {
          reply: retry.reply,
        });
      } else {
        logWarn(agent, "Retry failed → skip");

        continue;
      }
    }

    // =========================
    // 🔹 ENRICHED CONTEXT
    // =========================

    const enrichedContext = {
      ...context,

      activity: {
        hasCommit: context.activity?.hasCommit ?? false,

        commitTime: context.activity?.commitTime ?? null,
      },

      repository: context.repo ?? context.repository ?? null,

      semantic: {
        type: context.commit?.type ?? null,

        actionTag: context.commit?.actionTag ?? null,
      },
    };

    const story = buildStoryLayer({
      context: enrichedContext,
      meta: finalResult.meta,
      extra: context,
    });

    // =========================
    // 🔹 FINAL PAYLOAD
    // =========================

    const payload = {
      source,

      reply: finalResult.reply,

      meta: finalResult.meta,

      context: {
        mode,
        tag,
        ...enrichedContext,
      },

      story,

      created_at: Date.now(),
    };

    // =========================
    // 🔹 SAVE MEMORY
    // =========================

    setMemory(agent, `${agent}.last_message`, payload.reply);
    setMemory(agent, `${agent}.last_tone`, payload.meta.tone);
    setMemory(agent, `${agent}.last_greeting`, payload.meta.greeting);

    // =========================
    // 🔹 STATS
    // =========================

    const stats = getMemory(agent, `${agent}.stats`) || {};

    updateAgentStats({
      stats,
      context: {
        tag,
        mode,
        commit: context.commit,
      },
      result: finalResult,
      validation,
    });

    generateMonthSummary(stats);

    // =========================
    // 🔹 ARCHIVE MEMORY
    // =========================

    await archiveMemory({
      source,
      agent,
      result: finalResult,
      context: payload.context,
      stats,
      validation,
    });

    // =========================
    // 🔹 OUTPUT
    // =========================

    console.log("\n💜 FINAL REPLY:\n");

    console.log(payload.reply);
  }
}
