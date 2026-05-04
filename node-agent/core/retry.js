export async function retryGenerate({
  agent,
  config,
  mode,
  tag,
  composeReply,
  isDuplicate,
  maxRetry = 3
}) {
  let attempt = 0;

  while (attempt < maxRetry) {
    const seedGreet = Math.floor(Math.random() * 1000) + attempt * 7;
    const seedMsg = Math.floor(Math.random() * 1000) + attempt * 13;
    
    const result = composeReply(
      config[agent],
      mode,
      tag,
      seedGreet,
      seedMsg
    );
    
    if (!result?.reply) {
      attempt++;
      continue;
    }
    
    if (!isDuplicate(result)) {
      return result;
    }
    
    attempt++;
  }

  return null;
}