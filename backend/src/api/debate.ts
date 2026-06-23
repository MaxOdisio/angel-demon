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

    let sunnyPrevious = debateData.conversationHistory.at(-1)?.sunny ?? "";
    let crowleyPrevious = debateData.conversationHistory.at(-1)?.crowley ?? "";

    const resCrowley = await getCrowleyResponse(debateData.dilemma, debateData.conversationHistory, sunnyPrevious);
    crowleyPrevious = resCrowley;
    const resSunny = await getSunnyResponse(debateData.dilemma, debateData.conversationHistory, crowleyPrevious);
    sunnyPrevious = resSunny;
    const resJudge = await getDebateJudgement(debateData.dilemma, sunnyPrevious, crowleyPrevious, debateData.conversationHistory, debateData.currentAlignment);

    const result: DebateResponse = {
      sunny: sunnyPrevious,
      crowly: crowleyPrevious,
      judgement: resJudge
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error during debate handling:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "The service is temporarily unavailable. Please try again later."
    });
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
