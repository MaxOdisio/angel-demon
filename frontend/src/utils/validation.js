export function validateDebateResponse(data) {
  if (!data || typeof data !== "object") return false;
  // Campi top level
  if (typeof data.sunny !== "string" || !data.sunny.trim()) return false;
  if (typeof data.crowley !== "string" || !data.crowley.trim()) return false;
  // Judgement
  const j = data.judgement;
  if (!j || typeof j !== "object") return false;
  if (typeof j.roundWinner !== "string") return false;
  if (typeof j.sunnyScore !== "number" || typeof j.crowleyScore !== "number")
    return false;
  if (typeof j.alignmentDelta !== "number") return false;
  if (!["heaven", "hell", "neutral"].includes(j.userLeaning)) return false;

  return true;
}
