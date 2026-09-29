import { createGitHubCommitEvent } from "../../../events/github/github.adapter.js";
import { handleEvent } from "../event.handler.js";
import { registerEventHandlers } from "../event.router.js";

import { handleCommit } from "../../../engine/activity/commit.engine.js";

registerEventHandlers({
  "activity.commit": handleCommit,
});

const githubPayload = {
  repository: {
    full_name: "fridfn/workflow-development",
  },

  ref: "refs/heads/main",

  sender: {
    id: 123456,
    login: "fridfn",
  },

  head_commit: {
    id: "abc123",
    message: "feat(agent): integrate event system",
    timestamp: new Date().toISOString(),
  },
};

const event = createGitHubCommitEvent(githubPayload);

console.log("\n📦 EVENT");
console.log(event);

const result = await handleEvent(event);

console.log("\n📦 RESULT");
console.log(result);
