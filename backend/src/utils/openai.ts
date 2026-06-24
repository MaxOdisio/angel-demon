import {
  SUNNY_SYSTEM_PROMPT,
  CROWLEY_SYSTEM_PROMPT,
  DEBATE_JUDGE_PROMPT,
} from "../constants/characters.js";
import { OPENAI_API_KEY } from "../constants/env.js";
import { JudgeResponse, Message, Round } from "../types/debate_types.js";

const openAIClient = {
  baseURL: "https://api.openai.com/v1/chat/completions",
  apiKey: OPENAI_API_KEY,
};

async function chatCompletion(
  systemPrompt: string,
  messages: Message[],
  temperature = 0.9,
): Promise<string> {
  const response = await fetch(openAIClient.baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIClient.apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature,
      max_tokens: 300,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Build context messages for a character, including conversation history
 * and the opponent's last message for debate dynamics.
 */
function buildContextMessages(
  dilemma: string,
  conversationHistory: Round[],
  opponentLastMessage: string,
  characterId: string,
): Message[] {
  const messages = [];

  // Add history context
  if (conversationHistory.length > 0) {
    const historyText = conversationHistory
      .slice(-3) // last 3 rounds
      .map((round) => {
        let ctx = `USER DILEMMA: ${round.dilemma}`;
        if (round.userResponse) ctx += `\nUSER RESPONSE: ${round.userResponse}`;
        ctx += `\nSUNNY SAID: ${round.sunny}`;
        ctx += `\nCROWLEY SAID: ${round.crowley}`;
        return ctx;
      })
      .join("\n\n---\n\n");

    messages.push({
      role: "user",
      content: `PREVIOUS CONVERSATION HISTORY:\n${historyText}\n\nRemember this context and adapt your strategy accordingly.`,
    });
    messages.push({
      role: "assistant",
      content: `I remember our previous exchanges and I'm adjusting my approach based on what I've learned about this soul.`,
    });
  }

  // Current dilemma
  let currentPrompt = `NEW DILEMMA FROM THE HUMAN: "${dilemma}"`;

  if (opponentLastMessage) {
    const opponentName = characterId === "sunny" ? "Crowley" : "Sunny";
    currentPrompt += `\n\n${opponentName.toUpperCase()} JUST ARGUED: "${opponentLastMessage}"\n\nNow respond to this dilemma AND counter ${opponentName}'s argument. Be specific about what they said.`;
  }

  messages.push({ role: "user", content: currentPrompt });
  return messages;
}

export async function getSunnyResponse(
  dilemma: string,
  conversationHistory: Round[],
  crowleyMessage: string,
): Promise<string> {
  const messages = buildContextMessages(
    dilemma,
    conversationHistory,
    crowleyMessage,
    "sunny",
  );
  return chatCompletion(SUNNY_SYSTEM_PROMPT, messages);
}

// NOTE: at this moment Sunny never has a message to pass as argument because Crowley always speaks first.
export async function getCrowleyResponse(
  dilemma: string,
  conversationHistory: Round[],
  sunnyMessage: string,
): Promise<string> {
  const messages = buildContextMessages(
    dilemma,
    conversationHistory,
    sunnyMessage,
    "crowley",
  );
  return chatCompletion(CROWLEY_SYSTEM_PROMPT, messages);
}

export async function getDebateJudgement(
  dilemma: string,
  sunnyResponse: string,
  crowleyResponse: string,
  conversationHistory: Round[],
  currentAlignment: number,
): Promise<JudgeResponse> {
  const prompt = `
DILEMMA: "${dilemma}"

SUNNY ARGUED: "${sunnyResponse}"

CROWLEY ARGUED: "${crowleyResponse}"

CURRENT ALIGNMENT: ${currentAlignment} (scale: -100=Hell to +100=Heaven)

CONVERSATION ROUNDS SO FAR: ${conversationHistory.length}

Judge this debate round.`;

  try {
    const judgeRaw = await chatCompletion(
      DEBATE_JUDGE_PROMPT,
      [{ role: "user", content: prompt }],
      0.3
    );
    const text = judgeRaw.trim();
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    // Fallback judgement
    console.warn("Judge JSON parsing failed, using fallback:", err)
    return {
      roundWinner: "tie",
      winnerReason: "Both made compelling arguments.",
      sunnyScore: 50,
      crowleyScore: 50,
      alignmentDelta: 0,
      judgement: "The cosmic scales remain balanced.",
      userLeaning: "neutral",
    };
  }
}
