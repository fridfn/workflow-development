import {
  getMemory,
  setMemory
} from "../memory/memory.js";

// =========================
// 🔹 PUSH COMMIT LOG
// =========================
export function pushCommitLog(
  agent,
  payload,
  limit = 100
) {
  const path = "stats.commit_logs";

  const logs =
    getMemory(agent, path) || [];

  logs.unshift({
    ...payload,
    created_at: Date.now()
  });

  const finalLogs =
    limit === null
      ? logs
      : logs.slice(0, limit);

  setMemory(
    agent,
    path,
    finalLogs
  );
}

// =========================
// 🔹 PUSH REPLY LOG
// =========================
export function pushReplyLog(
  agent,
  payload,
  limit = 100
) {
  const path = "stats.reply_logs";

  const logs =
    getMemory(agent, path) || [];

  logs.unshift({
    ...payload,
    created_at: Date.now()
  });

  const finalLogs =
    limit === null
      ? logs
      : logs.slice(0, limit);

  setMemory(
    agent,
    path,
    finalLogs
  );
}