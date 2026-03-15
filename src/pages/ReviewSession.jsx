import { useState, useMemo, useCallback } from 'react'
import LatexRenderer from '../components/LatexRenderer'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  RotateCcw,
  ChevronRight,
  Trophy,
  Brain,
  Zap,
  X,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import useStore from '../store/useStore'

const QUALITY_BUTTONS = [
  { key: 'again', label: 'Otra vez', color: 'from-danger-500 to-danger-400', textColor: 'text-danger-400', desc: '< 1 min' },
  { key: 'hard', label: 'Difícil', color: 'from-warning-500 to-warning-400', textColor: 'text-warning-400', desc: '~3 días' },
  { key: 'good', label: 'Bien', color: 'from-success-500 to-success-400', textColor: 'text-success-400', desc: '~7 días' },
  { key: 'easy', label: 'Fácil', color: 'from-primary-500 to-primary-400', textColor: 'text-primary-400', desc: '~14 días' },
]

function CompletionScreen({ stats, onRestart }) {
  const navigate = useNavigate()
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-slide-up">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success-400/20 to-primary-500/20 flex items-center justify-center mb-6">
        <Trophy className="w-10 h-10 text-warning-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Sesión completada</h2>
      <p className="text-surface-200/50 text-sm mb-8">Excelente trabajo</p>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="text-center">
          <p className="text-3xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-surface-200/40 mt-1">Repasadas</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-success-400">{accuracy}%</p>
          <p className="text-xs text-surface-200/40 mt-1">Precisión</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary-400">{stats.correct}</p>
          <p className="text-xs text-surface-200/40 mt-1">Correctas</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-surface-200/70 text-sm font-medium rounded-xl transition-all"
        >
          Volver al inicio
        </button>
        <button
          onClick={onRestart}
          className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all"
        >
          Repasar de nuevo
        </button>
      </div>
    </div>
  )
}

export default function ReviewSession() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const deckId = searchParams.get('deck')
  const { decks, getDueCards, reviewCard } = useStore()

  const [flipped, setFlipped] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionStats, setSessionStats] = useState({ total: 0, correct: 0 })
  const [completed, setCompleted] = useState(false)
  const [selectedDeck, setSelectedDeck] = useState(deckId || '')

  const dueCards = useMemo(() => getDueCards(selectedDeck || null), [selectedDeck])

  const currentCard = dueCards[currentIndex]

  const handleAnswer = useCallback(
    (quality) => {
      if (!currentCard) return
      reviewCard(currentCard.id, quality)

      setSessionStats((prev) => ({
        total: prev.total + 1,
        correct: prev.correct + (quality === 'good' || quality === 'easy' ? 1 : 0),
      }))

      setFlipped(false)
      if (currentIndex + 1 >= dueCards.length) {
        setCompleted(true)
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    },
    [currentCard, currentIndex, dueCards.length, reviewCard]
  )

  const handleRestart = () => {
    setCurrentIndex(0)
    setCompleted(false)
    setFlipped(false)
    setSessionStats({ total: 0, correct: 0 })
  }

  if (completed) {
    return <CompletionScreen stats={sessionStats} onRestart={handleRestart} />
  }

  if (dueCards.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-surface-200/60" />
          </button>
          <h1 className="text-2xl font-bold text-white">Sesión de Repaso</h1>
        </div>

        {/* Deck selector */}
        <div className="mb-6">
          <select
            value={selectedDeck}
            onChange={(e) => setSelectedDeck(e.target.value)}
            className="bg-surface-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 w-full max-w-xs"
          >
            <option value="">Todos los mazos</option>
            {decks.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 rounded-full bg-success-400/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-success-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Todo al día</h2>
          <p className="text-sm text-surface-200/50">No hay tarjetas pendientes para repasar</p>
        </div>
      </div>
    )
  }

  const progress = ((currentIndex) / dueCards.length) * 100

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-surface-200/60" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Sesión de Repaso</h1>
            <p className="text-xs text-surface-200/40">
              {currentIndex + 1} de {dueCards.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-success-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {sessionStats.correct}
          </div>
          <div className="flex items-center gap-1.5 text-danger-400">
            <XCircle className="w-3.5 h-3.5" />
            {sessionStats.total - sessionStats.correct}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-surface-800 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Deck selector */}
      <div className="mb-6">
        <select
          value={selectedDeck}
          onChange={(e) => {
            setSelectedDeck(e.target.value)
            setCurrentIndex(0)
            setFlipped(false)
          }}
          className="bg-surface-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
        >
          <option value="">Todos los mazos</option>
          {decks.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center mb-8">
        <div
          className="card-flip w-full max-w-lg cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <div className={`card-flip-inner relative w-full ${flipped ? 'flipped' : ''}`} style={{ minHeight: '280px' }}>
            {/* Front */}
            <div className="card-front absolute inset-0 bg-gradient-to-br from-surface-900 to-surface-850 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl">
              <div className="flex items-center gap-2 text-xs text-surface-200/30 mb-4">
                <Brain className="w-3.5 h-3.5" />
                Pregunta
              </div>
              <p className="text-lg md:text-xl text-white font-medium text-center leading-relaxed">
                <LatexRenderer text={currentCard?.front} />
              </p>
              <p className="text-xs text-surface-200/30 mt-6 flex items-center gap-1">
                Toca para ver la respuesta
                <RotateCcw className="w-3 h-3" />
              </p>
            </div>

            {/* Back */}
            <div className="card-back absolute inset-0 bg-gradient-to-br from-surface-850 to-surface-900 border border-primary-500/20 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl">
              <div className="flex items-center gap-2 text-xs text-primary-400/50 mb-4">
                <Zap className="w-3.5 h-3.5" />
                Respuesta
              </div>
              <p className="text-lg md:text-xl text-white font-medium text-center leading-relaxed">
                <LatexRenderer text={currentCard?.back} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Answer buttons */}
      {flipped && (
        <div className="flex justify-center gap-2 md:gap-3 animate-slide-up">
          {QUALITY_BUTTONS.map((btn) => (
            <button
              key={btn.key}
              onClick={() => handleAnswer(btn.key)}
              className="flex flex-col items-center gap-1 px-4 md:px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all group"
            >
              <span className={`text-sm font-semibold ${btn.textColor}`}>
                {btn.label}
              </span>
              <span className="text-[10px] text-surface-200/30">{btn.desc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
