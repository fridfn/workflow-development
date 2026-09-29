export function createEvent({
  source,
  event,
  actor = null,
  context = {},
  payload = {},
  metadata = {},
}) {
  return {
    id: crypto.randomUUID(),
    version: "1.0",

    source,

    event,

    timestamp: new Date().toISOString(),

    actor,

    context,

    payload,

    metadata,
  };
}
