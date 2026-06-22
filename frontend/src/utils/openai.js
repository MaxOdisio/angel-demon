import {
  SUNNY_SYSTEM_PROMPT,
  CROWLEY_SYSTEM_PROMPT,
  DEBATE_JUDGE_PROMPT,
} from "../constants/characters.js";

const getClient = (apiKey) => ({
  baseURL: "https://api.openai.com/v1",
  apiKey,
});

async function chatCompletion(
  apiKey,
  systemPrompt,
  messages,
  temperature = 0.9,
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
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
  dilemma,
  conversationHistory,
  opponentLastMessage,
  characterId,
) {
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
  apiKey,
  dilemma,
  conversationHistory,
  crowleyMessage,
) {
  const messages = buildContextMessages(
    dilemma,
    conversationHistory,
    crowleyMessage,
    "sunny",
  );
  return chatCompletion(apiKey, SUNNY_SYSTEM_PROMPT, messages);
}

export async function getCrowleyResponse(
  apiKey,
  dilemma,
  conversationHistory,
  sunnyMessage,
) {
  const messages = buildContextMessages(
    dilemma,
    conversationHistory,
    sunnyMessage,
    "crowley",
  );
  return chatCompletion(apiKey, CROWLEY_SYSTEM_PROMPT, messages);
}

// TODO refactor to use buildContextMessages()
export async function getDebateJudgement(
  apiKey,
  dilemma,
  sunnyResponse,
  crowleyResponse,
  conversationHistory,
  currentAlignment,
) {
  const prompt = `
DILEMMA: "${dilemma}"

SUNNY ARGUED: "${sunnyResponse}"

CROWLEY ARGUED: "${crowleyResponse}"

CURRENT ALIGNMENT: ${currentAlignment} (scale: -100=Hell to +100=Heaven)

CONVERSATION ROUNDS SO FAR: ${conversationHistory.length}

Judge this debate round.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 300,
      messages: [
        { role: "system", content: DEBATE_JUDGE_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  try {
    const text = data.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback judgement
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
