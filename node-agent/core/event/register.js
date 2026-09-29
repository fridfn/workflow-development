import { registerEventHandlers } from "./event.router.js";

import { handleCommit } from "../../engine/activity/commit.engine.js";
import { handleConversation } from "../../engine/conversation/conversation.engine.js";
import { handleReflection } from "../../engine/reflection/reflection.engine.js";

export function registerHandlers() {
  registerEventHandlers({
    "activity.commit": handleCommit,
    "conversation.message": handleConversation,
    "reflection.daily": handleReflection,
    "reflection.weekly": handleReflection,
    "reflection.monthly": handleReflection,
    "reflection.yearly": handleReflection,
  });
}
    