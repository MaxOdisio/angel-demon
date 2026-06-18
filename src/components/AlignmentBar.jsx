import React from 'react'

export default function AlignmentBar({ alignment, alignmentLabel, totalRounds }) {
  // Convert -100..100 to 0..100 for CSS positioning
  const percent = ((alignment + 100) / 200) * 100

  return (
    <div className="bg-[#12121A] border border-[#2A2A3A] rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-[#666680] uppercase tracking-widest">Soul Alignment</span>
        <span className="text-xs font-mono text-[#666680]">Round {totalRounds}</span>
      </div>

      {/* Label */}
      <div className="text-center mb-3">
        <span className="text-2xl">{alignmentLabel.icon}</span>
        <p className="text-sm font-display text-[#E8E8F0] mt-1">{alignmentLabel.label}</p>
        <p className="text-xs text-[#666680] font-mono mt-0.5">{alignment > 0 ? '+' : ''}{alignment}</p>
      </div>

      {/* Bar */}
      <div className="relative">
        {/* Labels */}
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-[#FB923C] font-mono">🔥 Hell</span>
          <span className="text-xs text-[#C084FC] font-mono">Heaven ✨</span>
        </div>

        {/* Track */}
        <div className="relative h-3 rounded-full overflow-hidden"
          style={{ background: 'linear-gradient(to right, #EF4444, #1A1A26 50%, #A855F7)' }}>
          {/* Center line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#2A2A3A] z-10" />
          
          {/* Indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#0A0A0F] z-20 transition-all duration-700 ease-out"
            style={{
              left: `calc(${percent}% - 8px)`,
              backgroundColor: alignment > 20 ? '#A855F7' : alignment < -20 ? '#EF4444' : '#888899',
              boxShadow: alignment > 20
                ? '0 0 10px #A855F780'
                : alignment < -20
                ? '0 0 10px #EF444480'
                : 'none',
            }}
          />
        </div>
      </div>
    </div>
  )
}
