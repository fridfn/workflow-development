import { buildStoryLayer } from "./story.mapper.js";

export function buildEntry({ context }) {
 
 console.log(JSON.stringify(
      context,
      null,
      2
    ))
  const entry = {
    source: context.source || "engine",
    reply: result.reply,
    meta: result.meta || {},
    context: context || {},
    extra: {
      commit: context.commit || null
    },
    created_at: Date.now()
  };

  return {
    ...entry,
    story: buildStoryLayer(entry)
  };
}