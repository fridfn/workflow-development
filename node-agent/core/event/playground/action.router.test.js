import {
  registerActionHandler,
  routeAction,
} from "../../action/action.router.js";

registerActionHandler("test.action", async (action) => {
  return {
    received: action.payload,
  };
});

const action = {
  id: "action-001",
  type: "test.action",
  version: 1,

  source: {
    type: "agent",
    eventId: null,
  },

  payload: {
    message: "hello",
  },

  context: {
    conversationId: null,
    userId: null,
  },

  metadata: {
    createdAt: new Date().toISOString(),
    priority: "normal",
  },
};

const result = await routeAction(action);

console.log(result);

const errResult = await routeAction({
    ...action,
    type: "unknown.action",
});

console.log(errResult);

// node --env-file=.env core/event/playground/action.router.test.js      