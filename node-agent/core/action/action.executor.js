import { createActionResult } from "./action.result.contract.js";

export async function executeAction(action, executor) {
  if (!action || typeof action !== "object") {
    throw new Error("Action is required.");
  }

  if (typeof executor !== "function") {
    throw new Error("Action executor must be a function.");
  }

  try {
    const result = await executor(action);

    return createActionResult({
      actionId: action.id,
      type: action.type,
      status: "success",
      result,
    });
  } catch (error) {
    return createActionResult({
      actionId: action.id,
      type: action.type,
      status: "failed",
      error: {
        code: error.code ?? "ACTION_EXECUTION_ERROR",
        message: error.message,
      },
    });
  }
}
