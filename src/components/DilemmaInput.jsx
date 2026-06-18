import React, { useState } from 'react'
import { EXAMPLE_DILEMMAS } from '../constants/characters.js'

export default function DilemmaInput({ onSubmit, isLoading }) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return
    onSubmit(value.trim())
    setValue('')
  }

  const handleExample = () => {
    const random = EXAMPLE_DILEMMAS[Math.floor(Math.random() * EXAMPLE_DILEMMAS.length)]
    setValue(random)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="space-y-3">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: '#12121A',
          border: '1px solid #2A2A3A',
        }}
      >
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Present your moral dilemma..."
          rows={3}
          className="w-full bg-transparent px-4 pt-4 pb-12 text-sm text-[#E8E8F0] placeholder-[#444455] resize-none outline-none font-body"
        />

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <button
            onClick={handleExample}
            disabled={isLoading}
            className="text-xs text-[#555570] hover:text-[#888899] transition-colors font-mono disabled:opacity-40"
          >
            🎲 random dilemma
          </button>

          <button
            onClick={handleSubmit}
            disabled={!value.trim() || isLoading}
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: value.trim() && !isLoading
                ? 'linear-gradient(135deg, #7C3AED, #C2410C)'
                : '#2A2A3A',
              color: value.trim() && !isLoading ? '#fff' : '#555570',
            }}
          >
            {isLoading ? 'Judging souls...' : 'Submit ⚡'}
          </button>
        </div>
      </div>

      <p className="text-xs text-[#333345] text-center font-mono">
        Press Enter to submit · Shift+Enter for new line
      </p>
    </div>
  )
}
