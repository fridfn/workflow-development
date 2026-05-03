import { getMemory, setMemory } from "./memory.js";

export function isInHistory(path, value) {
  const history = getMemory(path) || [];
  return history.includes(value);
}

export function pushHistory(path, value, limit = 5) {
  let history = getMemory(path) || [];

  history.unshift(value);

  if (history.length > limit) {
    history = history.slice(0, limit);
  }

  setMemory(path, history);
}