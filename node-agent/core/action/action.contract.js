export function createAction({
  id,
  type,
  version = 1,
  source = {},
  payload = {},
  context = {},
  metadata = {},
}) {
  return {
    id,
    type,
    version,

    source: {
      type: source.type ?? null,
      eventId: source.eventId ?? null,
    },

    payload,

    context: {
      conversationId: context.conversationId ?? null,
      userId: context.userId ?? null,
    },

    metadata: {
      createdAt: metadata.createdAt ?? new Date().toISOString(),
      priority: metadata.priority ?? "normal",
    },
  };
}
