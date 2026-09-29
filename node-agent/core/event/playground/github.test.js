import { createGitHubCommitEvent } from "../../../events/github/github.adapter.js";
import { handleEvent } from "../event.handler.js";
import { registerEventHandlers } from "../event.router.js";

async function handleCommit(event) {
  console.log("\n🚀 COMMIT EVENT RECEIVED");

  console.log("Repository:", event.context.repository);
  console.log("Branch:", event.context.branch);
  console.log("Commit:", event.payload.sha);
  console.log("Message:", event.payload.message);

  return {
    status: "processed",
    eventId: event.id,
  };
}

registerEventHandlers({
  "activity.commit": handleCommit,
});

const githubPayload = {
  ref: "refs/heads/main",

  repository: {
    full_name: "fridfn/workflow-development",
  },

  sender: {
    id: 123456,
    login: "fridfn",
  },

  head_commit: {
    id: "abc123",
    message: "test event architecture",
    timestamp: new Date().toISOString(),
  },
};

const event = createGitHubCommitEvent(githubPayload);

const result = await handleEvent(event);

console.log("\n📦 RESULT");
console.log(result);
