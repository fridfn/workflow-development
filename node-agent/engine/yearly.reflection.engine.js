// memory/yearly.reflection.engine.js

import fs from "fs";
import path from "path";

export function generateYearlyReflection({
  yearDir,
  outputFile
}) {

  if (!fs.existsSync(yearDir)) {
    return null;
  }
console.log("YEAR DIR:", yearDir);
console.log("EXISTS:", fs.existsSync(yearDir));
console.log("MONTHS:", fs.readdirSync(yearDir));
  const months =
    fs.readdirSync(yearDir);

  const reflections = [];

  for (const month of months) {

    const monthPath =
      path.join(
        yearDir,
        month
      );

    if (
      !fs.statSync(
        monthPath
      ).isDirectory()
    ) {
      continue;
    }

    reflections.push({
      month,
      reviewed_at:
        Date.now()
    });
  }

  const yearlyReflection = {
    generated_at:
      Date.now(),

    total_months:
      reflections.length,

    reflection:
      "Farid terus tumbuh perlahan sepanjang tahun ini.",

    memories:
      reflections
  };

  fs.writeFileSync(
    outputFile,
    JSON.stringify(
      yearlyReflection,
      null,
      2
    )
  );

  return yearlyReflection;
}