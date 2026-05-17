import fs from "fs";
import { generateLLM } from "./core/generate.js";
import { safeJSONParse } from "./parsers/json.parser.js";
import { buildDailyPrompt } from "./prompts/daily.prompt.js";
import { buildWeeklyPrompt } from "./prompts/weekly.prompt.js";
import { buildMonthlyPrompt } from "./prompts/monthly.prompt.js";
import { buildYearlyPrompt } from "./prompts/yearly.prompt.js";
import { saveDecode } from "../utils/decode.file.js"
import { buildEntry } from "../engine/enrichment/entry.builder.js"
const PROMPTS = {
  daily: buildDailyPrompt,
  weekly: buildWeeklyPrompt,
  monthly: buildMonthlyPrompt,
  yearly: buildYearlyPrompt
};

const config = JSON.parse(
    fs.readFileSync("./config/agent.config.json")
  );
  
export async function generateReflection({
  agent,
  type,
  data,
  baseDir,
  fileName,
  outputFile,
  provider = "groq",
  model = "llama-3.1-8b-instant"
}) {
  const agents = config[agent];
  const agentSource = agents.system;
  const systemParts = {
    persona: agentSource.partner,
    behavior: agentSource.cara_bicara_aurielle_nara_elowen,
    closing: agentSource.penutup_dari_aurielle
  };
  
  const agentPersona = JSON.stringify(systemParts)
  
 //  const enrichStory = await saveDecode({
//    baseDir,
//    fileName,
//    raw: data
//   });
  const compactContext = data.slice(-10).map(item => ({ context: item.context }));
  const enrichStory = buildEntry({ context: compactContext })
  console.log({compactContext, enrichStory})
  const buildPrompt = PROMPTS[type];
  const prompt = buildPrompt({ data });
  
  if (!buildPrompt) {
    throw new Error(
      `Unknown reflection type: ${type}`
    );
  }
    
 //  const raw =
//     await generateLLM({
//       provider,
//       model,
// 
//       system: agentPersona,
// 
//       prompt,
// 
//       temperature: 0.8,
//       max_tokens: 1200
//     });
//     
//   fs.writeFileSync(
//     outputFile,
//     JSON.stringify(
//       raw,
//       null,
//       2
//     )
//   );

  return "parsed";
}