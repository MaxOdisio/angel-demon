import React from 'react'

export default function PromotionBoard({ promotionScore, totalRounds }) {
  const total = promotionScore.sunny + promotionScore.crowley
  const sunnyPct = total > 0 ? (promotionScore.sunny / total) * 100 : 50
  const crowleyPct = total > 0 ? (promotionScore.crowley / total) * 100 : 50

  const leader = promotionScore.sunny > promotionScore.crowley
    ? 'sunny'
    : promotionScore.crowley > promotionScore.sunny
    ? 'crowley'
    : 'tie'

  return (
    <div className="bg-[#12121A] border border-[#2A2A3A] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-[#666680] uppercase tracking-widest">Promotion Race</span>
        {leader !== 'tie' && (
          <span className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{
              backgroundColor: leader === 'sunny' ? '#7C3AED20' : '#C2410C20',
              color: leader === 'sunny' ? '#C084FC' : '#FB923C',
            }}>
            {leader === 'sunny' ? '😇 Leading' : '😈 Leading'}
          </span>
        )}
      </div>

      {/* Scores */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-center">
          <div className="text-2xl font-display text-[#C084FC]">{promotionScore.sunny}</div>
          <div className="text-xs text-[#666680] mt-0.5">Sunny</div>
          <div className="text-xs text-[#888899]">souls ✨</div>
        </div>

        <div className="text-center">
          <div className="text-xs text-[#444455] font-mono">VS</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-display text-[#FB923C]">{promotionScore.crowley}</div>
          <div className="text-xs text-[#666680] mt-0.5">Crowley</div>
          <div className="text-xs text-[#888899]">souls 🔥</div>
        </div>
      </div>

      {/* Bar */}
      {total > 0 && (
        <div className="h-2 rounded-full overflow-hidden flex">
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${sunnyPct}%`, background: 'linear-gradient(to right, #7C3AED, #C084FC)' }}
          />
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${crowleyPct}%`, background: 'linear-gradient(to right, #FB923C, #EF4444)' }}
          />
        </div>
      )}

      {totalRounds === 0 && (
        <p className="text-xs text-[#444455] text-center mt-2 font-mono">Submit a dilemma to begin</p>
      )}
    </div>
  )
}
