const allowedActionTypes = new Set(["telegram.send_message"]);

export function isActionTypeAllowed(type) {
  return allowedActionTypes.has(type);
}
