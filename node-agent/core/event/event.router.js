const handlers = new Map();

export function registerHandler(eventName, handler) {
  if (typeof handler !== "function") {
    throw new TypeError(`Handler for "${eventName}" must be a function.`);
  }

  handlers.set(eventName, handler);
}

export function registerEventHandlers(handlers = {}) {
  for (const [eventName, handler] of Object.entries(handlers)) {
    registerHandler(eventName, handler);
  }
}

export function resolveHandler(event) {
  const eventName = getEventName(event);

  return handlers.get(eventName) ?? null;
}

export function getEventName(event) {
  return `${event.event.category}.${event.event.type}`;
}
