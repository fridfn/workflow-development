export function validateResult({
  result,
  last,
  lastGreeting,
  lastTone,
  isInHistory,
  agent
}) {
  const reasons = [];

  const text = result.reply;

  if (!text) reasons.push("empty");
  if (text === last) reasons.push("same_message");
  if (isInHistory(`${agent}.history`, text)) reasons.push("in_history");
  if (result.meta?.greeting === lastGreeting) reasons.push("same_greeting");
  if (result.meta?.tone === lastTone) {
  reasons.push("same_tone");
    // allow 20% chance lolos
    if (Math.random() < 0.10) {
      return { isValid: true, reasons: ["same_tone_allowed"] };
    }
  }
  
  return {
    isValid: reasons.length === 0,
    reasons
  };
}