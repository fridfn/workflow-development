import fs from "fs";

const MEMORY_FILE = new URL("../memory.json", import.meta.url).pathname;

function ensureFile() {
  if (!fs.existsSync(MEMORY_FILE)) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify({}, null, 2));
  }
}

function readMemory() {
  ensureFile();

  try {
    const raw = fs.readFileSync(MEMORY_FILE, "utf-8").trim();

    if (!raw) return {};

    return JSON.parse(raw);
  } catch (err) {
    console.warn("⚠️ Memory corrupted, resetting...");
    fs.writeFileSync(MEMORY_FILE, JSON.stringify({}, null, 2));
    return {};
  }
}

function writeMemory(data) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
}

export function getMemory(path) {
  const data = readMemory();
  return path.split(".").reduce((o, k) => o?.[k], data);
}

export function setMemory(path, value) {
  const data = readMemory();
  const keys = path.split(".");
  let cur = data;

  keys.slice(0, -1).forEach(k => {
    if (!cur[k]) cur[k] = {};
    cur = cur[k];
  });

  cur[keys[keys.length - 1]] = value;

  writeMemory(data);
}

export function pushHistory(path, value, limit = 5) {
  const mem = readMemory();
  let arr = getNested(mem, path);

  if (!Array.isArray(arr)) arr = [];

  arr.unshift(value);
  arr = arr.slice(0, limit);

  setNested(mem, path, arr);
  writeMemory(mem);
}

export function isInHistory(path, value) {
  const mem = readMemory();
  const arr = getNested(mem, path);
  return Array.isArray(arr) && arr.includes(value);
}

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function setNested(obj, path, value) {
  const keys = path.split(".");
  let current = obj;

  keys.slice(0, -1).forEach(key => {
    if (!current[key]) current[key] = {};
    current = current[key];
  });

  current[keys[keys.length - 1]] = value;
}