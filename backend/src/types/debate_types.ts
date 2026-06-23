export type Debate = {
  dilemma: string,
  conversationHistory: Round[],
  currentAlignment: number
};

export type Round = {
  dilemma: string,
  sunny: string,
  crowley: string,
  userResponse?: string,
  judgement?: JudgeResponse
};

export type JudgeResponse = {
  roundWinner: string,
  winnerReason: string,
  sunnyScore: number,
  crowleyScore: number,
  alignmentDelta: number,
  judgement: string,
  userLeaning: UserLeaning
}

export type UserLeaning = "heaven" | "hell" | "neutral";

export type DebateResponse = {
  sunny: string,
  crowly: string,
  judgement: JudgeResponse
};
