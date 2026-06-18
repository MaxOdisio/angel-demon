import React from 'react'
import { CHARACTERS } from '../constants/characters.js'

function TypingIndicator({ color }) {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="typing-dot w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function CharacterCard({ characterId, message, isLoading, isWinner, score }) {
  const char = CHARACTERS[characterId]

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${characterId === 'sunny' ? '#1a1228' : '#1a0e08'}, #12121A)`,
        border: `1px solid ${char.accentColor}30`,
        boxShadow: isWinner ? `0 0 20px ${char.glowColor}40` : 'none',
      }}
    >
      {/* Winner badge */}
      {isWinner && (
        <div
          className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-mono font-medium z-10"
          style={{ backgroundColor: `${char.accentColor}25`, color: char.accentColor }}
        >
          ⭐ Won Round
        </div>
      )}

      {/* Header */}
      <div
        className="px-4 pt-4 pb-3 border-b"
        style={{ borderColor: `${char.accentColor}20` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl animate-float"
            style={{
              background: `radial-gradient(circle, ${char.accentColor}30, transparent)`,
              border: `1px solid ${char.accentColor}50`,
            }}
          >
            {char.emoji}
          </div>
          <div>
            <div className="font-display font-semibold text-sm" style={{ color: char.accentColor }}>
              {char.name}
            </div>
            <div className="text-xs text-[#555570]">{char.title}</div>
          </div>
        </div>
        {score !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-[#2A2A3A] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${score}%`,
                  background: `linear-gradient(to right, ${char.glowColor}, ${char.accentColor})`,
                }}
              />
            </div>
            <span className="text-xs font-mono text-[#555570]">{score}%</span>
          </div>
        )}
      </div>

      {/* Message */}
      <div className="px-4 py-4 min-h-[80px]">
        {isLoading ? (
          <TypingIndicator color={char.accentColor} />
        ) : message ? (
          <p className="text-sm text-[#C8C8D8] leading-relaxed animate-slide-up">
            {message}
          </p>
        ) : (
          <p className="text-sm text-[#444455] italic">Waiting for a dilemma...</p>
        )}
      </div>
    </div>
  )
}
