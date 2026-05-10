export function getTopKey(obj = {}) {
  let topKey = null;
  let topValue = -1;

  for (const key in obj) {
    if (obj[key] > topValue) {
      topValue = obj[key];
      topKey = key;
    }
  }

  return topKey;
}