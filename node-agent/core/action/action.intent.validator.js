import { isActionTypeAllowed } from "./action.intent.policy.js";

export function validateActionIntent(intent) {
  if (!intent || typeof intent !== "object") {
    throw new Error("Action intent must be an object.");
  }

  if (!intent.type) {
    throw new Error("Action intent type is required.");
  }

  if (!isActionTypeAllowed(intent.type)) {
    throw new Error(`Action intent type is not allowed: ${intent.type}`);
  }

  if (!intent.payload || typeof intent.payload !== "object") {
    throw new Error("Action intent payload is required.");
  }

  return true;
}
