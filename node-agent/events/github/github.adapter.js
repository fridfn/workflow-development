import { createEvent } from "../../core/event/event.contract.js";

export function createGitHubCommitEvent(payload) {
  return createEvent({
    source: {
      type: "github",
      id: payload.repository?.full_name ?? "unknown",
    },

    event: {
      category: "activity",
      type: "commit",
    },

    actor: {
      id: payload.sender?.id ?? null,
      name: payload.sender?.login ?? null,
    },

    context: {
      repository: payload.repository?.full_name ?? null,
      branch: payload.ref ?? null,
    },

    payload: {
      sha: payload.head_commit?.id ?? null,
      message: payload.head_commit?.message ?? null,
      timestamp: payload.head_commit?.timestamp ?? null,
    },

    metadata: {
      provider: "github",
    },
  });
}
