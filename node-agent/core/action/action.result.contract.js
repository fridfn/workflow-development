export function createActionResult({
  actionId,
  type,
  status,
  result = null,
  error = null,
  metadata = {},
}) {
  return {
    actionId,
    type,
    status,

    result,

    error,

    metadata: {
      completedAt: metadata.completedAt ?? new Date().toISOString(),
    },
  };
}
