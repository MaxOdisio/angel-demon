import { Request, Response } from "express";
import { getCrowleyResponse, getDebateJudgement, getSunnyResponse } from "../utils/openai.js";
import { Debate, DebateResponse, UserLeaning } from "../types/debate_types.js";

export async function handlerDebate(req: Request, res: Response) {
  try {
    const debateData = req.body;
    if (!debateValidation(debateData)) {
      res.status(400).json({
        error: "Bad Request",
        message: "Dilemma must be a non-empty string between 1 and 400 characters..."
      });
      return;
    }

    let sunnyLast = "";
    let crowlyLast = "";
    const lastRound = debateData.conversationHistory.at(-1);
    if (lastRound) {
      sunnyLast = lastRound.sunny;
      crowlyLast = lastRound.crowley;
    }

    const resCrowly = await getCrowleyResponse(debateData.dilemma, debateData.conversationHistory, sunnyLast);
    crowlyLast = resCrowly;
    const resSunny = await getSunnyResponse(debateData.dilemma, debateData.conversationHistory, crowlyLast);
    sunnyLast = resSunny;
    const resJudge = await getDebateJudgement(debateData.dilemma, sunnyLast, crowlyLast, debateData.conversationHistory, debateData.currentAlignment);

    const result: DebateResponse = {
      sunny: sunnyLast,
      crowly: crowlyLast,
      judgement: resJudge
    }

    return res.status(200).json({ message: JSON.stringify(result) });
  } catch (err) {
    res.status(400).json({
      error: "Bad Request",
      message: "The service is temporarily unavailable. Please try again later."
    });
    console.error("Error during debate handling:", err);
    return;
  }
}

function debateValidation(debate: any): debate is Debate {
  if (!debate || typeof debate !== 'object') return false;
  if (typeof debate.dilemma !== 'string' || debate.dilemma.trim() === "" || debate.dilemma.length > 400) return false; // also checks if dilemma is too long
  if (typeof debate.currentAlignment !== 'number') return false;
  if (!Array.isArray(debate.conversationHistory)) return false;

  if (debate.conversationHistory.length > 0) {
    for (const round of debate.conversationHistory) {
      if (typeof round.dilemma !== 'string' || typeof round.sunny !== 'string' || typeof round.crowley !== 'string') return false;

      const j = round.judgement;
      if (!j || typeof j !== 'object') return false;
      if (typeof j.roundWinner !== 'string' || typeof j.winnerReason !== 'string' || typeof j.judgement !== 'string') return false;
      if (typeof j.sunnyScore !== 'number' || typeof j.crowleyScore !== 'number' || typeof j.alignmentDelta !== 'number') return false;

      const validLeanings: UserLeaning[] = ["heaven", "hell", "neutral"];
      if (!validLeanings.includes(j.userLeaning)) return false;
    }
  }

  return true
}
