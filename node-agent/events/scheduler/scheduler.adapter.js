import { createEvent } from "../../core/event/event.contract.js";

export function createScheduledEvent({ category, type, payload = {} }) {
  return createEvent({
    source: {
      type: "scheduler",
      id: "internal",
    },

    event: {
      category,
      type,
    },

    payload,

    metadata: {
      provider: "scheduler",
    },
  });
}
