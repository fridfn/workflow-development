export function validateActionResult(actionResult) {
  if (!actionResult || typeof actionResult !== "object") {
    throw new Error("Action result must be an object.");
  }

  if (!actionResult.actionId) {
    throw new Error("Action result actionId is required.");
  }

  if (!actionResult.type) {
    throw new Error("Action result type is required.");
  }

  if (!actionResult.status) {
    throw new Error("Action result status is required.");
  }

  if (!["success", "failed"].includes(actionResult.status)) {
    throw new Error("Action result status must be 'success' or 'failed'.");
  }

  if (!actionResult.metadata || typeof actionResult.metadata !== "object") {
    throw new Error("Action result metadata must be an object.");
  }

  return true;
}
