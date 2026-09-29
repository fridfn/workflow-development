export function validateEvent(event) {
  if (!event || typeof event !== "object") {
    throw new TypeError("Event must be an object.");
  }

  if (!event.id) {
    throw new Error("Event id is required.");
  }

  if (!event.version) {
    throw new Error("Event version is required.");
  }

  if (!event.source?.type) {
    throw new Error("Event source.type is required.");
  }

  if (!event.event?.category) {
    throw new Error("Event category is required.");
  }

  if (!event.event?.type) {
    throw new Error("Event type is required.");
  }

  if (!event.timestamp) {
    throw new Error("Event timestamp is required.");
  }

  return true;
}
