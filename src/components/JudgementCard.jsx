import React from 'react'
import { CHARACTERS } from '../constants/characters.js'

export default function JudgementCard({ judgement, alignmentBefore, alignmentAfter }) {
  if (!judgement) return null

  const delta = alignmentAfter - alignmentBefore
  const winner = judgement.roundWinner
  const winnerChar = winner !== 'tie' ? CHARACTERS[winner] : null

  const deltaColor = delta > 0 ? '#C084FC' : delta < 0 ? '#FB923C' : '#888899'
  const deltaLabel = delta > 0 ? `+${delta} toward Heaven` : delta < 0 ? `${delta} toward Hell` : 'No change'

  return (
    <div
      className="rounded-2xl border border-[#2A2A3A] overflow-hidden animate-slide-up"
      style={{ background: '#0E0E18' }}
    >
      <div className="px-4 py-3 border-b border-[#2A2A3A] flex items-center justify-between">
        <span className="text-xs font-mono text-[#666680] uppercase tracking-widest">⚖️ Cosmic Judgement</span>
        {winnerChar ? (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{ backgroundColor: `${winnerChar.accentColor}20`, color: winnerChar.accentColor }}
          >
            {winnerChar.emoji} {winnerChar.name} wins
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-[#2A2A3A] text-[#888899]">
            ⚖️ Tie
          </span>
        )}
      </div>

      <div className="px-4 py-3 space-y-2">
        <p className="text-sm text-[#C8C8D8] italic">"{judgement.judgement}"</p>
        <p className="text-xs text-[#666680]">{judgement.winnerReason}</p>

        <div className="flex items-center gap-2 pt-1">
          <div
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${deltaColor}15`, color: deltaColor }}
          >
            {deltaLabel}
          </div>
        </div>
      </div>
    </div>
  )
}
