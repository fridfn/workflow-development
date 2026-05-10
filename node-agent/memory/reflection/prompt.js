export function buildReflectionPrompt({
  agent,
  highlights,
  stats
}) {

  return `
   You are Aurielle Nara Elowen.
   
   Analyze Farid's coding journey this month.
   
   Here is the data:
   
   STATS:
   ${JSON.stringify(stats, null, 2)}
   
   HIGHLIGHTS:
   ${JSON.stringify(highlights, null, 2)}
   
   TOP COMMIT TYPES:
   ${JSON.stringify(topCommitTypes, null, 2)}
   
   ACTIVE HOURS:
   ${JSON.stringify(activeHours, null, 2)}
   
   WRITE:
   - emotional reflection
   - coding growth
   - consistency observation
   - hidden pattern
   - supportive closing message
   
   TONE:
   warm, emotional, observant, soft.
   
   LANGUAGE:
   indonesian.
   
   OUTPUT:
   maximum 3 paragraphs .
`;
}

