import React, { useState } from 'react'
import { CHARACTERS } from '../constants/characters.js'

function RoundItem({ round, index }) {
  const [expanded, setExpanded] = useState(false)
  const delta = round.alignmentAfter - round.alignmentBefore
  const winner = round.judgement?.roundWinner
  const winnerChar = winner && winner !== 'tie' ? CHARACTERS[winner] : null

  return (
    <div
      className="rounded-xl border border-[#1E1E2A] overflow-hidden cursor-pointer hover:border-[#2A2A3A] transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-[#444455] shrink-0">#{index + 1}</span>
          <p className="text-xs text-[#888899] truncate">{round.dilemma}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {winnerChar && (
            <span className="text-xs" title={`${winnerChar.name} won`}>{winnerChar.emoji}</span>
          )}
          {delta !== 0 && (
            <span
              className="text-xs font-mono"
              style={{ color: delta > 0 ? '#C084FC' : '#FB923C' }}
            >
              {delta > 0 ? '+' : ''}{delta}
            </span>
          )}
          <span className="text-xs text-[#333345]">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#1E1E2A] px-3 py-3 space-y-3">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xs shrink-0">😈</span>
              <p className="text-xs text-[#888899] leading-relaxed">{round.crowley}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs shrink-0">😇</span>
              <p className="text-xs text-[#888899] leading-relaxed">{round.sunny}</p>
            </div>
          </div>
          {round.judgement?.judgement && (
            <p className="text-xs text-[#555570] italic border-t border-[#1E1E2A] pt-2">
              ⚖️ "{round.judgement.judgement}"
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function HistoryPanel({ history, onReset }) {
  if (history.length === 0) {
    return (
      <div className="bg-[#12121A] border border-[#2A2A3A] rounded-2xl p-4">
        <span className="text-xs font-mono text-[#666680] uppercase tracking-widest">History</span>
        <p className="text-xs text-[#333345] text-center mt-4 mb-2 font-mono">No rounds yet</p>
      </div>
    )
  }

  return (
    <div className="bg-[#12121A] border border-[#2A2A3A] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-[#666680] uppercase tracking-widest">
          History ({history.length})
        </span>
        <button
          onClick={onReset}
          className="text-xs text-[#444455] hover:text-[#EF4444] transition-colors font-mono"
        >
          Reset
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {[...history].reverse().map((round, i) => (
          <RoundItem key={round.id} round={round} index={history.length - 1 - i} />
        ))}
      </div>
    </div>
  )
}
