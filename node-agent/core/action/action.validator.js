export function validateAction(action) {
  if (!action || typeof action !== "object") {
    throw new Error("Action must be an object.");
  }

  if (!action.id) {
    throw new Error("Action id is required.");
  }

  if (!action.type) {
    throw new Error("Action type is required.");
  }

  if (!action.version) {
    throw new Error("Action version is required.");
  }

  if (!action.source || typeof action.source !== "object") {
    throw new Error("Action source is required.");
  }

  if (!action.payload || typeof action.payload !== "object") {
    throw new Error("Action payload is required.");
  }

  if (!action.context || typeof action.context !== "object") {
    throw new Error("Action context must be an object.");
  }

  if (!action.metadata || typeof action.metadata !== "object") {
    throw new Error("Action metadata must be an object.");
  }

  return true;
}
