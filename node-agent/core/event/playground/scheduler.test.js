import { createScheduledEvent } from "../../../events/scheduler/scheduler.adapter.js";

import { handleEvent } from "../event.handler.js";

import { registerEventHandlers } from "../event.router.js";

import { handleReflection } from "../../../engine/reflection/reflection.engine.js";

registerEventHandlers({
  "reflection.daily": handleReflection,
});

const event = createScheduledEvent({
  category: "reflection",
  type: "daily",
});

const result = await handleEvent(event);

console.log("\n📦 RESULT");

console.log(result);
