import { useState, useCallback } from "react";
import {
  INITIAL_ALIGNMENT,
  ALIGNMENT_LABELS,
} from "../constants/characters.js";
import { submitDebateDilemma } from "../utils/api.js";
import { validateDebateResponse } from "../utils/validation.js";

const STORAGE_KEY = "angel_demon_state";

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error("Error on loading state:", err);
  }
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Error saving state:", err);
  }
}

export function useGameState() {
  const [gameState, setGameState] = useState(() => {
    const saved = loadState();
    return {
      alignment: saved?.alignment ?? INITIAL_ALIGNMENT,
      conversationHistory: saved?.conversationHistory ?? [],
      totalRounds: saved?.totalRounds ?? 0,
      promotionScore: saved?.promotionScore ?? { sunny: 0, crowley: 0 }, // Promotion scores: total souls won per character
    };
  });

  const [currentRound, setCurrentRound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAlignmentLabel = useCallback((score) => {
    return (
      ALIGNMENT_LABELS.find((l) => score >= l.min && score < l.max) ||
      ALIGNMENT_LABELS[4]
    ); // default neutral
  }, []);

  const submitDilemma = useCallback(
    async (dilemma) => {
      if (!dilemma.trim() || isLoading) return null;

      setIsLoading(true);
      setError(null);

      try {
        const payload = {
          dilemma,
          conversationHistory: gameState.conversationHistory,
          currentAlignment: gameState.alignment,
        };

        // Call to server endpoint
        const debateResponse = await submitDebateDilemma(payload);

        if (!validateDebateResponse(debateResponse)) {
          throw new Error("Invalid response format from server");
        }

        const { sunny, crowley, judgement } = debateResponse;

        const roundId = Date.now();
        const timestamp = new Date().toISOString();

        // Calculate new alignment
        const newAlignment = clamp(
          gameState.alignment + (judgement.alignmentDelta || 0),
          -100,
          100,
        );

        // Update promotion scores based on round winner
        const newPromotionScore = { ...gameState.promotionScore };
        if (judgement.roundWinner === "sunny") {
          newPromotionScore.sunny += 1;
        } else if (judgement.roundWinner === "crowley") {
          newPromotionScore.crowley += 1;
        }

        const round = {
          id: roundId,
          dilemma,
          sunny,
          crowley,
          judgement,
          alignmentBefore: gameState.alignment,
          alignmentAfter: newAlignment,
          timestamp,
        };

        const newHistory = [...gameState.conversationHistory, round];
        const newTotalRounds = gameState.totalRounds + 1;

        const updatedState = {
          alignment: newAlignment,
          conversationHistory: newHistory,
          totalRounds: newTotalRounds,
          promotionScore: newPromotionScore,
        };

        saveState(updatedState);
        setGameState(updatedState);
        setCurrentRound(round);
        return round;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, gameState],
  );

  const resetGame = useCallback(() => {
    setGameState({
      alignment: INITIAL_ALIGNMENT,
      conversationHistory: [],
      totalRounds: 0,
      promotionScore: { sunny: 0, crowley: 0 },
    });
    setCurrentRound(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    alignment: gameState.alignment,
    alignmentLabel: getAlignmentLabel(gameState.alignment),
    conversationHistory: gameState.conversationHistory,
    currentRound,
    isLoading,
    error,
    totalRounds: gameState.totalRounds,
    promotionScore: gameState.promotionScore,
    submitDilemma,
    resetGame,
  };
}
