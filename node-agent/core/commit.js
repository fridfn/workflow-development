import "dotenv/config";

import { createGitHubCommitEvent } from "../events/github/github.adapter.js";
import { handleEvent } from "./event/event.handler.js";
import { registerEventHandlers } from "./event/event.router.js";

import { handleCommit } from "../engine/activity/commit.engine.js";

import { logInfo, logSection } from "../utils/logger.js";

logSection("COMMIT FLOW");

// =========================
// 🔹 REGISTER HANDLER
// =========================

registerEventHandlers({
  "activity.commit": handleCommit,
});

// =========================
// 🔹 GITHUB PAYLOAD
// =========================

// Payload ini nantinya berasal dari
// GitHub webhook / GitHub workflow.

const githubPayload = {
  repository: {
    full_name: process.env.GITHUB_REPOSITORY,
  },

  ref: process.env.GITHUB_REF,

  sender: {
    id: process.env.GITHUB_ACTOR_ID ?? null,
    login: process.env.GITHUB_ACTOR ?? null,
  },

  head_commit: {
    id: process.env.GITHUB_SHA,
    message: process.env.COMMIT_MESSAGE,
    timestamp: process.env.COMMIT_TIMESTAMP,
  },
};

logInfo("GITHUB", "Commit payload received", {
  repository: githubPayload.repository.full_name,
  branch: githubPayload.ref,
  commit: githubPayload.head_commit.id,
});

// =========================
// 🔹 CREATE EVENT
// =========================

const event = createGitHubCommitEvent(githubPayload);

// =========================
// 🔹 HANDLE EVENT
// =========================

const result = await handleEvent(event);

// =========================
// 🔹 RESULT
// =========================

logInfo("COMMIT", "Event processed", result);

logSection("COMMIT DONE");
