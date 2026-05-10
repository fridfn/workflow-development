import fs from "fs";
import path from "path";

// =========================
// 🔹 BASE DIRECTORY
// =========================
const MEMORY_DIR = new URL("./active", import.meta.url).pathname;

// =========================
// 🔹 GET FILE PATH
// =========================
function getMemoryFile(agent = "default") {
  return path.join(
    MEMORY_DIR,
    `${agent}.memory.json`
  );
}

// =========================
// 🔹 ENSURE FILE
// =========================
function ensureFile(agent) {
  const file = getMemoryFile(agent);

  fs.mkdirSync(
    path.dirname(file),
    { recursive: true }
  );

  if (!fs.existsSync(file)) {
    fs.writeFileSync(
      file,
      JSON.stringify({}, null, 2)
    );
  }
}

// =========================
// 🔹 READ MEMORY
// =========================
function readMemory(agent) {
  ensureFile(agent);

  const file = getMemoryFile(agent);

  try {
    const raw = fs
      .readFileSync(file, "utf-8")
      .trim();

    if (!raw) return {};

    return JSON.parse(raw);

  } catch (err) {
    console.warn(
      `⚠️ Memory corrupted (${agent}), resetting...`
    );

    fs.writeFileSync(
      file,
      JSON.stringify({}, null, 2)
    );

    return {};
  }
}

// =========================
// 🔹 WRITE MEMORY
// =========================
function writeMemory(agent, data) {
  const file = getMemoryFile(agent);

  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}

// =========================
// 🔹 GET MEMORY
// =========================
export function getMemory(agent, path) {
  const data = readMemory(agent);

  if (!path) return data;

  return path
    .split(".")
    .reduce((o, k) => o?.[k], data);
}

// =========================
// 🔹 SET MEMORY
// =========================
export function setMemory(agent, path, value) {
  const data = readMemory(agent);

  const keys = path.split(".");
  let cur = data;

  keys.slice(0, -1).forEach(k => {
    if (!cur[k]) cur[k] = {};
    cur = cur[k];
  });

  cur[keys[keys.length - 1]] = value;

  writeMemory(agent, data);
}

// =========================
// 🔹 PUSH HISTORY
// =========================
export function pushHistory(
  agent,
  path,
  value,
  limit = 5
) {
  const mem = readMemory(agent);

  let arr = getNested(mem, path);

  if (!Array.isArray(arr)) {
    arr = [];
  }

  arr.unshift(value);

  // unlimited kalau null
  if (limit !== null) {
    arr = arr.slice(0, limit);
  }

  setNested(mem, path, arr);

  writeMemory(agent, mem);
}

// =========================
// 🔹 CHECK HISTORY
// =========================
export function isInHistory(
  agent,
  path,
  value
) {
  const mem = readMemory(agent);

  const arr = getNested(mem, path);

  return (
    Array.isArray(arr) &&
    arr.includes(value)
  );
}

// =========================
// 🔹 INTERNAL HELPERS
// =========================
function getNested(obj, path) {
  return path
    .split(".")
    .reduce(
      (acc, key) => acc?.[key],
      obj
    );
}

function setNested(obj, path, value) {
  const keys = path.split(".");
  let current = obj;

  keys.slice(0, -1).forEach(key => {
    if (!current[key]) {
      current[key] = {};
    }

    current = current[key];
  });

  current[keys[keys.length - 1]] = value;
}