function flattenObject(
  obj = {},
  prefix = "",
  result = {}
) {
  for (const key in obj) {
    const value = obj[key];

    const newKey = prefix
      ? `${prefix}.${key}`
      : key;

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

export function extractStorySignals(entry) {
  return {
    ...flattenObject(entry.context),
    ...flattenObject(entry.extra),
    ...flattenObject(entry.meta)
  };
}