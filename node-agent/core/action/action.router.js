const actionHandlers = new Map();

export function registerActionHandler(type, handler) {
  if (!type) {
    throw new Error("Action type is required.");
  }

  if (typeof handler !== "function") {
    throw new Error("Action handler must be a function.");
  }

  actionHandlers.set(type, handler);
}

export async function routeAction(action) {
  if (!action || typeof action !== "object") {
    throw new Error("Action is required.");
  }

  const handler = actionHandlers.get(action.type);

  if (!handler) {
    throw new Error(`No handler registered for action: ${action.type}`);
  }

  return await handler(action);
}
