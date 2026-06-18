import { useState, useCallback } from 'react'
import { getSunnyResponse, getCrowleyResponse, getDebateJudgement } from '../utils/openai.js'
import { INITIAL_ALIGNMENT, ALIGNMENT_LABELS } from '../constants/characters.js'

const STORAGE_KEY = 'angel_demon_state'

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return null
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function useGameState(apiKey) {
  const saved = loadState()

  const [alignment, setAlignment] = useState(saved?.alignment ?? INITIAL_ALIGNMENT)
  const [conversationHistory, setConversationHistory] = useState(saved?.conversationHistory ?? [])
  const [currentRound, setCurrentRound] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalRounds, setTotalRounds] = useState(saved?.totalRounds ?? 0)
  
  // Promotion scores: total souls won per character
  const [promotionScore, setPromotionScore] = useState(
    saved?.promotionScore ?? { sunny: 0, crowley: 0 }
  )

  const getAlignmentLabel = useCallback((score) => {
    return ALIGNMENT_LABELS.find(l => score >= l.min && score < l.max) 
      || ALIGNMENT_LABELS[4] // default neutral
  }, [])

  const submitDilemma = useCallback(async (dilemma) => {
    if (!dilemma.trim() || isLoading) return
    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Crowley goes first (demons are eager)
      const crowleyResponse = await getCrowleyResponse(
        apiKey,
        dilemma,
        conversationHistory,
        null
      )

      // Step 2: Sunny responds, aware of Crowley's argument
      const sunnyResponse = await getSunnyResponse(
        apiKey,
        dilemma,
        conversationHistory,
        crowleyResponse
      )

      // Step 3: Get cosmic judgement
      const judgement = await getDebateJudgement(
        apiKey,
        dilemma,
        sunnyResponse,
        crowleyResponse,
        conversationHistory,
        alignment
      )

      // Calculate new alignment
      const newAlignment = clamp(alignment + (judgement.alignmentDelta || 0), -100, 100)

      // Update promotion scores based on round winner
      const newPromotionScore = { ...promotionScore }
      if (judgement.roundWinner === 'sunny') {
        newPromotionScore.sunny += 1
      } else if (judgement.roundWinner === 'crowley') {
        newPromotionScore.crowley += 1
      }

      const round = {
        id: Date.now(),
        dilemma,
        sunny: sunnyResponse,
        crowley: crowleyResponse,
        judgement,
        alignmentBefore: alignment,
        alignmentAfter: newAlignment,
        timestamp: new Date().toISOString(),
      }

      const newHistory = [...conversationHistory, round]
      const newTotalRounds = totalRounds + 1

      setCurrentRound(round)
      setConversationHistory(newHistory)
      setAlignment(newAlignment)
      setPromotionScore(newPromotionScore)
      setTotalRounds(newTotalRounds)

      // Persist state
      saveState({
        alignment: newAlignment,
        conversationHistory: newHistory,
        promotionScore: newPromotionScore,
        totalRounds: newTotalRounds,
      })

      return round
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [apiKey, alignment, conversationHistory, promotionScore, totalRounds, isLoading])

  const resetGame = useCallback(() => {
    setAlignment(INITIAL_ALIGNMENT)
    setConversationHistory([])
    setCurrentRound(null)
    setPromotionScore({ sunny: 0, crowley: 0 })
    setTotalRounds(0)
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    alignment,
    alignmentLabel: getAlignmentLabel(alignment),
    conversationHistory,
    currentRound,
    isLoading,
    error,
    totalRounds,
    promotionScore,
    submitDilemma,
    resetGame,
  }
}
