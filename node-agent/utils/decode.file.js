import fs from "fs/promises";
import path from "path";

function decodeMarkdown(text = "") {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .trim();
}

export async function saveDecode({
  raw,
  baseDir,
  filename
}) {
  /*
    raw      -> response raw dari LLM
    baseDir  -> folder tujuan
    filename -> nama file tanpa extension
  */
  const parsed = JSON.parse(raw);

  const markdown =
    decodeMarkdown(parsed.content);

  // metadata JSON
  const metadata = {
    error: parsed.error,
    created_at: parsed.created_at
  };

  // pastikan folder ada
  await fs.mkdir(baseDir, {
    recursive: true
  });

  // path file
  const jsonPath =
    path.join(baseDir, `${filename}.json`);

  const mdPath =
    path.join(baseDir, `${filename}.md`);

  // save metadata json
  await fs.writeFile(
    jsonPath,
    JSON.stringify(metadata, null, 2)
  );

  // save markdown reflection
  await fs.writeFile(
    mdPath,
    markdown
  );

  return {
    jsonPath,
    mdPath
  };
}