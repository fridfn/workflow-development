import fs from "fs";

// =========================
// 🔹 ENSURE DIRECTORY
// =========================
export function ensureDir(dir) {
  fs.mkdirSync(dir, {
    recursive: true
  });
}

// =========================
// 🔹 ENSURE FILE
// =========================
export function ensureFile(
  file,
  fallback = []
) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(
      file,
      JSON.stringify(
        fallback,
        null,
        2
      )
    );
  }
}

// =========================
// 🔹 ENSURE MANY FILES
// =========================
export function ensureFiles(
  files = []
) {
  for (const item of files) {
    ensureFile(
      item.file,
      item.fallback
    );
  }
}

// =========================
// 🔹 READ JSON
// =========================
export function readJSON(
  file,
  fallback = []
) {
  ensureFile(file, fallback);

  try {
    return JSON.parse(
      fs.readFileSync(
        file,
        "utf-8"
      )
    );
  } catch {
    return fallback;
  }
}

// =========================
// 🔹 WRITE JSON
// =========================
export function writeJSON(
  file,
  data
) {
  fs.writeFileSync(
    file,
    JSON.stringify(
      data,
      null,
      2
    )
  );
}