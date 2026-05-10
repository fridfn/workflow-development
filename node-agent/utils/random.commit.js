// randomCommit.js

import fs from "fs";

// baca file json
const commitData = JSON.parse(
  fs.readFileSync("./commit.example.json", "utf-8")
);

// 🎲 randomizer
export function getRandomCommit() {
  const commits = commitData.commit;

  const randomIndex = Math.floor(Math.random() * commits.length);

  return commits[randomIndex];
}