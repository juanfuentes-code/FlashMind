import { useNavigate } from 'react-router-dom'
import {
  Play,
  BookOpen,
  Flame,
  TrendingUp,
  Clock,
  Layers,
  ChevronRight,
  Zap,
  Target,
} from 'lucide-react'
import useStore from '../store/useStore'

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-surface-900/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {sub && <span className="text-[11px] text-surface-200/40 mt-1">{sub}</span>}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-surface-200/50 mt-1">{label}</p>
    </div>
  )
}

function DeckCard({ deck, stats, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface-900/40 border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:bg-surface-900/60 transition-all group"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: deck.color }}
        />
        <h3 className="text-sm font-semibold text-white flex-1 truncate">{deck.name}</h3>
        <ChevronRight className="w-4 h-4 text-surface-200/30 group-hover:text-surface-200/60 transition-colors" />
      </div>
      <div className="flex gap-4 text-xs">
        <div>
          <span className="text-primary-400 font-semibold">{stats.due}</span>
          <span className="text-surface-200/40 ml-1">pendientes</span>
        </div>
        <div>
          <span className="text-success-400 font-semibold">{stats.mature}</span>
          <span className="text-surface-200/40 ml-1">dominadas</span>
        </div>
        <div>
          <span className="text-surface-200/60 font-semibold">{stats.total}</span>
          <span className="text-surface-200/40 ml-1">total</span>
        </div>
      </div>
      {stats.total > 0 && (
        <div className="mt-3 h-1.5 bg-surface-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-success-400 transition-all"
            style={{ width: `${(stats.mature / stats.total) * 100}%` }}
          />
        </div>
      )}
    </button>
  )
}

function MiniBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.reviewed), 1)
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full relative" style={{ height: '60px' }}>
            <div
              className="absolute bottom-0 w-full rounded-sm bg-gradient-to-t from-primary-500/80 to-primary-400/40 transition-all"
              style={{ height: `${Math.max((d.reviewed / max) * 100, 4)}%` }}
            />
          </div>
          <span className="text-[9px] text-surface-200/30">{d.day}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { decks, cards, getDeckStats, getStreakDays, getWeeklyStats, getDueCards } = useStore()

  const totalDue = getDueCards().length
  const streak = getStreakDays()
  const weeklyStats = getWeeklyStats()
  const totalReviewedToday = weeklyStats[weeklyStats.length - 1]?.reviewed || 0
  const totalCards = cards.length

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-surface-200/50 mt-1">
            Resumen de tu progreso de aprendizaje
          </p>
        </div>
        {totalDue > 0 && (
          <button
            onClick={() => navigate('/review')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20"
          >
            <Play className="w-4 h-4" />
            Repasar ({totalDue})
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={Target}
          label="Pendientes hoy"
          value={totalDue}
          color="#3b82f6"
          sub="tarjetas"
        />
        <StatCard
          icon={Flame}
          label="Racha actual"
          value={`${streak} d`}
          color="#f59e0b"
          sub="dias"
        />
        <StatCard
          icon={Zap}
          label="Repasadas hoy"
          value={totalReviewedToday}
          color="#22c55e"
        />
        <StatCard
          icon={Layers}
          label="Total tarjetas"
          value={totalCards}
          color="#8b5cf6"
        />
      </div>

      {/* Weekly Activity + Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 bg-surface-900/60 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Actividad semanal</h2>
            <TrendingUp className="w-4 h-4 text-surface-200/30" />
          </div>
          <MiniBarChart data={weeklyStats} />
        </div>
        <div className="bg-surface-900/60 border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-white mb-1">Acciones rápidas</h2>
          <button
            onClick={() => navigate('/review')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium text-surface-200/70 hover:text-white transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            Iniciar repaso
          </button>
          <button
            onClick={() => navigate('/import')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium text-surface-200/70 hover:text-white transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Importar tarjetas
          </button>
          <button
            onClick={() => navigate('/glossary')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium text-surface-200/70 hover:text-white transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
            Gestionar mazos
          </button>
        </div>
      </div>

      {/* Decks */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Mis mazos</h2>
          <button
            onClick={() => navigate('/glossary')}
            className="text-xs text-primary-400 hover:text-primary-300 font-medium"
          >
            Ver todos
          </button>
        </div>
        {decks.length === 0 ? (
          <div className="bg-surface-900/40 border border-dashed border-white/10 rounded-2xl p-12 text-center">
            <Layers className="w-10 h-10 text-surface-200/20 mx-auto mb-3" />
            <p className="text-sm text-surface-200/50 mb-4">No tienes mazos todavía</p>
            <button
              onClick={() => navigate('/import')}
              className="px-4 py-2 bg-primary-500/20 text-primary-400 text-xs font-semibold rounded-lg hover:bg-primary-500/30 transition-all"
            >
              Importar tarjetas
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {decks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                stats={getDeckStats(deck.id)}
                onClick={() => navigate(`/glossary?deck=${deck.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
