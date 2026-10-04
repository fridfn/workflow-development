export function normalizeReflectionMaterial(value, limit = 10) {
  if (Array.isArray(value)) {
    return value.slice(-limit);
  }

  if (value !== null && typeof value === "object") {
    return value;
  }

  return value ?? null;
}
