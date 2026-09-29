import { parseCommit } from "../../utils/parser.js";
import { resolveDailyMode } from "../../utils/time.js";
import { runEngine } from "../../core/run.engine.js";

export async function handleCommit(event) {
  const { repository, branch } = event.context;

  const { sha, message, timestamp } = event.payload;

  // =========================
  // 🔹 PARSE COMMIT
  // =========================

  const parsed = parseCommit(message);

  // =========================
  // 🔹 RESOLVE MODE
  // =========================

  const { mode, shouldSend, skip, hour } = resolveDailyMode({
    hasCommit: true,
  });

  // =========================
  // 🔹 SKIP
  // =========================

  if (skip || !shouldSend) {
    return {
      status: "skipped",
      eventId: event.id,
      reason: "daily mode skipped",
    };
  }

  // =========================
  // 🔹 RUN EXISTING ENGINE
  // =========================

  await runEngine({
    source: "commit",
    mode,
    tag: parsed.actionTag,

    context: {
      repo: repository,
      branch,
      commitTime: timestamp,

      activity: {
        hasCommit: true,
        commitTime: timestamp,
      },

      commit: {
        ...parsed,
        sha,
        message,
        timestamp,
      },
    },
  });

  return {
    status: "processed",
    eventId: event.id,

    activity: {
      repository,
      branch,
      sha,
      message,
      timestamp,
    },

    mode: {
      mode,
      hour,
    },

    semantic: {
      type: parsed.type,
      actionTag: parsed.actionTag,
    },
  };
}
