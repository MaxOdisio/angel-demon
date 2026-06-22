import React, { useState } from 'react'

export default function ApiKeySetup({ onKeySet }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const trimmed = key.trim()
    if (!trimmed.startsWith('sk-')) {
      setError('OpenAI API keys start with "sk-"')
      return
    }
    setError('')
    onKeySet(trimmed)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #A855F7, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #EF4444, transparent)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl animate-float">😇</span>
            <span className="text-2xl text-[#333345]">⚡</span>
            <span className="text-4xl animate-float" style={{ animationDelay: '1s' }}>😈</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#E8E8F0] tracking-wide">
            Angel vs Demon
          </h1>
          <p className="text-sm text-[#555570] mt-2">The Promotion</p>
        </div>

        {/* Card */}
        <div className="bg-[#12121A] border border-[#2A2A3A] rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-mono text-[#666680] uppercase tracking-widest block mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="sk-..."
              className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-3 text-sm text-[#E8E8F0] placeholder-[#333345] outline-none focus:border-[#444455] transition-colors font-mono"
            />
            {error && (
              <p className="text-xs text-[#EF4444] mt-2 font-mono">{error}</p>
            )}
          </div>

          <p className="text-xs text-[#444455] font-mono leading-relaxed">
            Your key is stored locally in this browser. It never leaves your device.
          </p>

          <button
            onClick={handleSubmit}
            disabled={!key.trim()}
            className="w-full py-3 rounded-xl text-sm font-mono font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: key.trim()
                ? 'linear-gradient(135deg, #7C3AED, #C2410C)'
                : '#2A2A3A',
              color: key.trim() ? '#fff' : '#555570',
            }}
          >
            Begin the Judgement ⚡
          </button>
        </div>

        <p className="text-center text-xs text-[#2A2A3A] mt-4 font-mono">
          gpt-4o · Built for the promotion competition
        </p>
      </div>
    </div>
  )
}
