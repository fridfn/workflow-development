import { createAction } from "./action.contract.js";

export function buildActionFromIntent(
  intent,
  { id, source = {}, context = {}, metadata = {} },
) {
  if (!intent || typeof intent !== "object") {
    throw new Error("Action intent is required.");
  }

  return createAction({
    id,
    type: intent.type,
    source,
    payload: intent.payload,
    context,
    metadata,
  });
}
