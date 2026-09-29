import { validateEvent } from "./event.validator.js";
import { resolveHandler } from "./event.router.js";
import { registerHandler } from "./event.router.js";

export async function handleEvent(event) {
  validateEvent(event);

  const handler = resolveHandler(event);

  if (!handler) {
    throw new Error(
      `No handler registered for ${event.event.category}.${event.event.type}`,
    );
  }

  return handler(event);
}


export function registerEventHandlers(handlers = {}) {
  for (const [eventName, handler] of Object.entries(handlers)) {
    registerHandler(eventName, handler);
  }
}