import { useGameState } from './hooks/useGameState.js'
import CharacterCard from './components/CharacterCard.jsx'
import AlignmentBar from './components/AlignmentBar.jsx'
import PromotionBoard from './components/PromotionBoard.jsx'
import DilemmaInput from './components/DilemmaInput.jsx'
import JudgementCard from './components/JudgementCard.jsx'
import HistoryPanel from './components/HistoryPanel.jsx'

function Header({ onReset }) {
  return (
    <header className="border-b border-[#1A1A26] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl">😇</span>
        <div>
          <h1 className="font-display text-sm font-semibold text-[#E8E8F0] tracking-wide">
            Angel vs Demon
          </h1>
          <p className="text-xs text-[#444455] font-mono">The Promotion</p>
        </div>
        <span className="text-xl">😈</span>
      </div>
      <button
        onClick={onReset}
        className="text-xs text-[#333345] hover:text-[#666680] transition-colors font-mono"
      >
        New Game
      </button>
    </header>
  )
}

function MainApp() {
  const {
    alignment,
    alignmentLabel,
    conversationHistory,
    currentRound,
    isLoading,
    error,
    totalRounds,
    promotionScore,
    submitDilemma,
    resetGame,
  } = useGameState()

  const handleReset = () => {
    resetGame()
    onLogout()
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #A855F7, transparent)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #EF4444, transparent)' }} />
      </div>

      <Header onReset={handleReset} />

      <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left sidebar */}
        <aside className="lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-[#1A1A26] p-4 space-y-4 overflow-y-auto">
          <AlignmentBar
            alignment={alignment}
            alignmentLabel={alignmentLabel}
            totalRounds={totalRounds}
          />
          <PromotionBoard
            promotionScore={promotionScore}
            totalRounds={totalRounds}
          />
          <HistoryPanel
            history={conversationHistory}
            onReset={resetGame}
          />
        </aside>

        {/* Main chat area */}
        <section className="flex-1 flex flex-col overflow-hidden">
          {/* Characters */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Character responses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CharacterCard
                characterId="crowley"
                message={currentRound?.crowley}
                isLoading={isLoading}
                isWinner={currentRound?.judgement?.roundWinner === 'crowley'}
                score={currentRound?.judgement?.crowleyScore}
              />
              <CharacterCard
                characterId="sunny"
                message={currentRound?.sunny}
                isLoading={isLoading}
                isWinner={currentRound?.judgement?.roundWinner === 'sunny'}
                score={currentRound?.judgement?.sunnyScore}
              />
            </div>

            {/* Judgement */}
            {currentRound?.judgement && !isLoading && (
              <JudgementCard
                judgement={currentRound.judgement}
                alignmentBefore={currentRound.alignmentBefore}
                alignmentAfter={currentRound.alignmentAfter}
              />
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/5 px-4 py-3">
                <p className="text-xs text-[#EF4444] font-mono">⚠️ {error}</p>
              </div>
            )}

            {/* Empty state */}
            {!currentRound && !isLoading && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex gap-4 mb-4">
                  <span className="text-5xl animate-float">😇</span>
                  <span className="text-5xl animate-float" style={{ animationDelay: '1.5s' }}>😈</span>
                </div>
                <h2 className="font-display text-lg text-[#444455] mb-2">
                  Present your dilemma
                </h2>
                <p className="text-sm text-[#333345] max-w-xs font-mono">
                  Sunny and Crowley are ready to compete for your soul. The one who convinces you gets the promotion.
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#1A1A26] p-4">
            <DilemmaInput onSubmit={submitDilemma} isLoading={isLoading} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default function App() {
  return <MainApp />
}
