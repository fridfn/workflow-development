import fs from "fs";
import { composeReply } from "./compose.js";
import { retryGenerate } from "./retry.js";
import { validateResult } from "../utils/validator.js";
import { archiveMemory } from "../memory/archive.js";
import { hasCommitToday } from "../utils/github.js";
import { buildStoryLayer } from "../engine/enrichment/story.mapper.js";

import {
  updateAgentStats,
  generateMonthSummary
} from "../utils/stats/index.js";

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

import {
  pushCommitLog,
  pushReplyLog
} from "../utils/analytics.js";

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
  const hasCommit = await hasCommitToday({
    username: "fridfn",
    token: process.env.GITHUB_TOKEN
  });
  
  const repoContext = hasCommit.repoMetadata;
  
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
    const last = getMemory(agent, "last_message");
    const lastGreeting = getMemory(agent, "last_greeting");
    const lastTone = getMemory(agent, "last_tone");

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
    // 🔹 ENRICHED CONTEXT
    // =========================
    const enrichedContext = {
      ...context,
    
      activity: {
        hasCommit: hasCommit?.hasCommit || false,
        commitTime: hasCommit?.commitTime || null
      },
    
      repository: repoContext,
    
      semantic: {
        type: context.commit?.type || null,
        detail: context.commit?.detail || null,
        actionTag: context.commit?.actionTag || null
      }
    };
    
    const story = buildStoryLayer({
      context: enrichedContext,
      meta: finalResult.meta,
      extra: context
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
        ...enrichedContext
      },
    
      story,
    
      created_at: Date.now()
    };

    // =========================
    // 🔹 SAVE MEMORY
    // =========================
    setMemory(
      agent,
      `${agent}.last_message`,
      payload.reply
    );
    
    setMemory(
      agent,
      `${agent}.last_tone`,
      payload.meta.tone
    );
    
    setMemory(
      agent,
      `${agent}.last_greeting`,
      payload.meta.greeting
    );
    
    pushHistory(
      agent,
      `${agent}.history`,
      payload,
      10
    );

    // =========================
    // 🔹 STATS
    // =========================
    const stats = getMemory(
      agent,
      `${agent}.stats`
    ) || {};
    
    updateAgentStats({
      stats,
      context: {
        tag,
        mode,
        commit: context.commit
      },
      result: finalResult,
      validation
    });
    
    generateMonthSummary(stats);
    
    setMemory(agent, `${agent}.stats`, stats);
    
    // =========================
    // 🔹 COMMIT MEMORY
    // =========================
    if (source === "commit") {
      const type =
        context.commit?.type || "unknown";
        
      const detail =
        context.commit?.detail || "unknown";

      pushCommitLog(agent, {
        type,
        mode,
        detail,
        reply: finalResult.reply
      });
      
      pushReplyLog(agent, {
        source: "commit",
        reply: finalResult.reply,
        meta: finalResult.meta,
        context: {
          mode,
          tag
        }
      });
    }
    
    // =========================
    // 🔹 ARCHIVE MEMORY
    // =========================
    await archiveMemory({
      source,
      agent,
      result: finalResult,
      context: payload.context,
      stats,
      validation
    });

    // =========================
    // 🔹 OUTPUT
    // =========================
    // logSection(`${agent} → FINAL`);
// 
//     logInfo(agent, "Reply ready");
// 
//     logDebug(agent, "Payload", payload);
// 
    console.log("\n💜 FINAL REPLY:\n");
    console.log(payload.reply);
  }
}