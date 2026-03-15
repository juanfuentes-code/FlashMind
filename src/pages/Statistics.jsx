import { useMemo } from 'react'
import {
  BarChart3,
  TrendingUp,
  Flame,
  Target,
  Calendar,
  Award,
  Brain,
  Clock,
  Layers,
} from 'lucide-react'
import useStore from '../store/useStore'

function StatBox({ icon: Icon, label, value, description, color }) {
  return (
    <div className="bg-surface-900/60 border border-white/5 rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-surface-200/50">{label}</p>
        </div>
      </div>
      {description && <p className="text-[11px] text-surface-200/30">{description}</p>}
    </div>
  )
}

function BarChart({ data, label }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div>
      <h3 className="text-xs font-medium text-surface-200/50 mb-3">{label}</h3>
      <div className="flex items-end gap-2 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[9px] text-surface-200/40">{d.value || ''}</span>
            <div className="w-full relative" style={{ height: '90px' }}>
              <div
                className="absolute bottom-0 w-full rounded-t-sm bg-gradient-to-t from-primary-500/80 to-primary-400/30 transition-all duration-500"
                style={{ height: `${Math.max((d.value / max) * 100, 2)}%` }}
              />
            </div>
            <span className="text-[9px] text-surface-200/30">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HeatmapRow({ dailyStats }) {
  const today = new Date()
  const cells = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const count = dailyStats[dateStr]?.reviewed || 0
    let opacity = 0
    if (count > 0) opacity = Math.min(0.2 + (count / 20) * 0.8, 1)

    cells.push(
      <div
        key={dateStr}
        className="w-3 h-3 rounded-sm transition-all"
        style={{
          backgroundColor: count > 0 ? `rgba(59, 130, 246, ${opacity})` : 'rgba(255,255,255,0.03)',
        }}
        title={`${dateStr}: ${count} tarjetas`}
      />
    )
  }

  return (
    <div>
      <h3 className="text-xs font-medium text-surface-200/50 mb-3">Últimos 30 días</h3>
      <div className="flex gap-1 flex-wrap">{cells}</div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[9px] text-surface-200/30">Menos</span>
        {[0.05, 0.2, 0.4, 0.7, 1].map((op) => (
          <div
            key={op}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: `rgba(59, 130, 246, ${op})` }}
          />
        ))}
        <span className="text-[9px] text-surface-200/30">Más</span>
      </div>
    </div>
  )
}

function DeckBreakdown({ decks, getDeckStats }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-surface-200/50 mb-3">Desglose por mazo</h3>
      <div className="space-y-3">
        {decks.map((deck) => {
          const stats = getDeckStats(deck.id)
          if (stats.total === 0) return null
          const masteredPct = Math.round((stats.mature / stats.total) * 100)
          return (
            <div key={deck.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: deck.color }} />
                  <span className="text-xs text-white font-medium">{deck.name}</span>
                </div>
                <span className="text-[10px] text-surface-200/40">{masteredPct}% dominado</span>
              </div>
              <div className="h-2 bg-surface-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-success-400/80 transition-all"
                  style={{ width: `${(stats.mature / stats.total) * 100}%` }}
                />
                <div
                  className="h-full bg-warning-400/80 transition-all"
                  style={{ width: `${(stats.learning / stats.total) * 100}%` }}
                />
                <div
                  className="h-full bg-primary-400/80 transition-all"
                  style={{ width: `${(stats.new / stats.total) * 100}%` }}
                />
              </div>
              <div className="flex gap-4 mt-1.5">
                <span className="text-[9px] text-success-400/70">Dominadas: {stats.mature}</span>
                <span className="text-[9px] text-warning-400/70">Aprendiendo: {stats.learning}</span>
                <span className="text-[9px] text-primary-400/70">Nuevas: {stats.new}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Statistics() {
  const { cards, decks, dailyStats, reviewHistory, getStreakDays, getWeeklyStats, getDeckStats } =
    useStore()

  const streak = getStreakDays()
  const weeklyStats = getWeeklyStats()

  const totalReviews = reviewHistory.length
  const totalMastered = cards.filter((c) => c.srsLevel >= 3).length
  const averageLevel =
    cards.length > 0
      ? (cards.reduce((sum, c) => sum + (c.srsLevel || 0), 0) / cards.length).toFixed(1)
      : '0'

  const weeklyData = weeklyStats.map((d) => ({
    label: d.day,
    value: d.reviewed,
  }))

  const todayStats = weeklyStats[weeklyStats.length - 1] || { reviewed: 0, correct: 0 }
  const todayAccuracy =
    todayStats.reviewed > 0
      ? Math.round((todayStats.correct / todayStats.reviewed) * 100)
      : 0

  const allTimeAccuracy =
    totalReviews > 0
      ? Math.round(
          (reviewHistory.filter((r) => r.quality === 'good' || r.quality === 'easy').length /
            totalReviews) *
            100
        )
      : 0

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Estadísticas</h1>
        <p className="text-sm text-surface-200/50 mt-1">
          Seguimiento detallado de tu progreso
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatBox
          icon={Flame}
          label="Racha actual"
          value={`${streak} días`}
          color="#f59e0b"
          description="Mantén tu racha diaria"
        />
        <StatBox
          icon={Target}
          label="Repasos totales"
          value={totalReviews}
          color="#3b82f6"
        />
        <StatBox
          icon={Award}
          label="Tarjetas dominadas"
          value={totalMastered}
          color="#22c55e"
          description={`de ${cards.length} totales`}
        />
        <StatBox
          icon={Brain}
          label="Precisión global"
          value={`${allTimeAccuracy}%`}
          color="#8b5cf6"
        />
      </div>

      {/* Today's summary */}
      <div className="bg-surface-900/60 border border-white/5 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-surface-200/40" />
          Resumen de hoy
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xl font-bold text-white">{todayStats.reviewed}</p>
            <p className="text-[11px] text-surface-200/40">Repasadas</p>
          </div>
          <div>
            <p className="text-xl font-bold text-success-400">{todayStats.correct}</p>
            <p className="text-[11px] text-surface-200/40">Correctas</p>
          </div>
          <div>
            <p className="text-xl font-bold text-primary-400">{todayAccuracy}%</p>
            <p className="text-[11px] text-surface-200/40">Precisión</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Weekly chart */}
        <div className="bg-surface-900/60 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Actividad semanal</h2>
            <TrendingUp className="w-4 h-4 text-surface-200/30" />
          </div>
          <BarChart data={weeklyData} label="" />
        </div>

        {/* Heatmap */}
        <div className="bg-surface-900/60 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Mapa de actividad</h2>
            <BarChart3 className="w-4 h-4 text-surface-200/30" />
          </div>
          <HeatmapRow dailyStats={dailyStats} />
        </div>
      </div>

      {/* Deck breakdown */}
      {decks.length > 0 && (
        <div className="bg-surface-900/60 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Progreso por mazo</h2>
            <Layers className="w-4 h-4 text-surface-200/30" />
          </div>
          <DeckBreakdown decks={decks} getDeckStats={getDeckStats} />
        </div>
      )}

      {/* Level distribution */}
      {cards.length > 0 && (
        <div className="bg-surface-900/60 border border-white/5 rounded-2xl p-5 mt-6">
          <h2 className="text-sm font-semibold text-white mb-4">Distribución de niveles SRS</h2>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((level) => {
              const count = cards.filter((c) => c.srsLevel === level).length
              const pct = cards.length > 0 ? (count / cards.length) * 100 : 0
              const colors = ['#64748b', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#06b6d4']
              return (
                <div key={level} className="flex-1 text-center">
                  <div className="h-20 relative mb-1.5">
                    <div
                      className="absolute bottom-0 w-full rounded-t-sm transition-all"
                      style={{
                        height: `${Math.max(pct, 3)}%`,
                        backgroundColor: `${colors[level]}80`,
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-surface-200/40">N{level}</p>
                  <p className="text-[10px] font-semibold text-surface-200/60">{count}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
