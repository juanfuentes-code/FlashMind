import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, supabaseConfigured } from '../lib/supabase'

const generateId = () => Math.random().toString(36).substring(2, 15)

const getToday = () => new Date().toISOString().split('T')[0]

const SRS_INTERVALS = [1, 3, 7, 14, 30, 60, 120]

function getNextReview(card, quality) {
  const now = new Date()
  let newLevel = card.srsLevel || 0

  if (quality === 'again') {
    newLevel = 0
  } else if (quality === 'hard') {
    newLevel = Math.max(0, newLevel - 1)
  } else if (quality === 'good') {
    newLevel = Math.min(SRS_INTERVALS.length - 1, newLevel + 1)
  } else if (quality === 'easy') {
    newLevel = Math.min(SRS_INTERVALS.length - 1, newLevel + 2)
  }

  const daysUntilNext = SRS_INTERVALS[newLevel] || 1
  const nextReview = new Date(now)
  nextReview.setDate(nextReview.getDate() + daysUntilNext)

  return {
    srsLevel: newLevel,
    nextReview: nextReview.toISOString(),
    lastReviewed: now.toISOString(),
    interval: daysUntilNext,
  }
}

// ─── Supabase helpers ────────────────────────────────────────────────────────

async function getUserId() {
  if (!supabaseConfigured) return null
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

async function dbUpsertDeck(deck, userId) {
  await supabase.from('decks').upsert({
    id: deck.id,
    user_id: userId,
    name: deck.name,
    description: deck.description ?? '',
    color: deck.color,
    created_at: deck.createdAt,
  })
}

async function dbUpsertCard(card, userId) {
  await supabase.from('cards').upsert({
    id: card.id,
    deck_id: card.deckId,
    user_id: userId,
    front: card.front,
    back: card.back,
    tags: card.tags ?? [],
    srs_level: card.srsLevel,
    next_review: card.nextReview,
    last_reviewed: card.lastReviewed,
    interval: card.interval,
    review_count: card.reviewCount,
    created_at: card.createdAt,
  })
}

async function dbUpsertDailyStats(date, stats, userId) {
  await supabase.from('daily_stats').upsert({
    user_id: userId,
    date,
    reviewed: stats.reviewed,
    correct: stats.correct,
  }, { onConflict: 'user_id,date' })
}

// ─── Store ───────────────────────────────────────────────────────────────────

const useStore = create(
  persist(
    (set, get) => ({
      decks: [],
      cards: [],
      reviewHistory: [],
      dailyStats: {},

      // Loads all user data from Supabase and replaces local state
      loadUserData: async (userId) => {
        if (!supabaseConfigured) return
        const [{ data: decks }, { data: cards }, { data: stats }] = await Promise.all([
          supabase.from('decks').select('*').eq('user_id', userId),
          supabase.from('cards').select('*').eq('user_id', userId),
          supabase.from('daily_stats').select('*').eq('user_id', userId),
        ])

        const mappedDecks = (decks ?? []).map((d) => ({
          id: d.id,
          name: d.name,
          description: d.description,
          color: d.color,
          createdAt: d.created_at,
        }))

        const mappedCards = (cards ?? []).map((c) => ({
          id: c.id,
          deckId: c.deck_id,
          front: c.front,
          back: c.back,
          tags: c.tags ?? [],
          srsLevel: c.srs_level,
          nextReview: c.next_review,
          lastReviewed: c.last_reviewed,
          interval: c.interval,
          reviewCount: c.review_count,
          createdAt: c.created_at,
        }))

        const mappedStats = {}
        for (const s of stats ?? []) {
          mappedStats[s.date] = { reviewed: s.reviewed, correct: s.correct }
        }

        set({ decks: mappedDecks, cards: mappedCards, dailyStats: mappedStats })
      },

      addDeck: async (name, description = '') => {
        const deck = {
          id: generateId(),
          name,
          description,
          createdAt: new Date().toISOString(),
          color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4'][
            Math.floor(Math.random() * 6)
          ],
        }
        set((state) => ({ decks: [...state.decks, deck] }))
        const userId = await getUserId()
        if (userId) await dbUpsertDeck(deck, userId)
        return deck.id
      },

      updateDeck: async (id, updates) => {
        set((state) => ({
          decks: state.decks.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }))
        const userId = await getUserId()
        if (userId) {
          const deck = get().decks.find((d) => d.id === id)
          if (deck) await dbUpsertDeck(deck, userId)
        }
      },

      deleteDeck: async (id) => {
        set((state) => ({
          decks: state.decks.filter((d) => d.id !== id),
          cards: state.cards.filter((c) => c.deckId !== id),
        }))
        const userId = await getUserId()
        if (userId) {
          await supabase.from('cards').delete().eq('deck_id', id).eq('user_id', userId)
          await supabase.from('decks').delete().eq('id', id).eq('user_id', userId)
        }
      },

      addCard: async (deckId, front, back, tags = []) => {
        const card = {
          id: generateId(),
          deckId,
          front,
          back,
          tags,
          srsLevel: 0,
          nextReview: new Date().toISOString(),
          lastReviewed: null,
          interval: 0,
          createdAt: new Date().toISOString(),
          reviewCount: 0,
        }
        set((state) => ({ cards: [...state.cards, card] }))
        const userId = await getUserId()
        if (userId) await dbUpsertCard(card, userId)
        return card.id
      },

      updateCard: async (id, updates) => {
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }))
        const userId = await getUserId()
        if (userId) {
          const card = get().cards.find((c) => c.id === id)
          if (card) await dbUpsertCard(card, userId)
        }
      },

      deleteCard: async (id) => {
        set((state) => ({ cards: state.cards.filter((c) => c.id !== id) }))
        const userId = await getUserId()
        if (userId) await supabase.from('cards').delete().eq('id', id).eq('user_id', userId)
      },

      reviewCard: async (cardId, quality) => {
        const state = get()
        const card = state.cards.find((c) => c.id === cardId)
        if (!card) return

        const srsUpdate = getNextReview(card, quality)
        const today = getToday()

        const review = {
          id: generateId(),
          cardId,
          deckId: card.deckId,
          quality,
          date: new Date().toISOString(),
          previousLevel: card.srsLevel,
          newLevel: srsUpdate.srsLevel,
        }

        const currentDaily = state.dailyStats[today] || { reviewed: 0, correct: 0 }
        const newDaily = {
          ...currentDaily,
          reviewed: currentDaily.reviewed + 1,
          correct: currentDaily.correct + (quality === 'good' || quality === 'easy' ? 1 : 0),
        }

        set({
          cards: state.cards.map((c) =>
            c.id === cardId
              ? { ...c, ...srsUpdate, reviewCount: (c.reviewCount || 0) + 1 }
              : c
          ),
          reviewHistory: [...state.reviewHistory, review],
          dailyStats: { ...state.dailyStats, [today]: newDaily },
        })

        const userId = await getUserId()
        if (userId) {
          const updatedCard = get().cards.find((c) => c.id === cardId)
          if (updatedCard) await dbUpsertCard(updatedCard, userId)
          await dbUpsertDailyStats(today, newDaily, userId)
        }
      },

      getDueCards: (deckId = null) => {
        const state = get()
        const now = new Date()
        return state.cards.filter((c) => {
          if (deckId && c.deckId !== deckId) return false
          return new Date(c.nextReview) <= now
        })
      },

      getDeckStats: (deckId) => {
        const state = get()
        const deckCards = state.cards.filter((c) => c.deckId === deckId)
        const now = new Date()
        const due = deckCards.filter((c) => new Date(c.nextReview) <= now)
        const newCards = deckCards.filter((c) => c.srsLevel === 0 && !c.lastReviewed)
        const learning = deckCards.filter(
          (c) => c.srsLevel > 0 && c.srsLevel < 3 && c.lastReviewed
        )
        const mature = deckCards.filter((c) => c.srsLevel >= 3)

        return {
          total: deckCards.length,
          due: due.length,
          new: newCards.length,
          learning: learning.length,
          mature: mature.length,
        }
      },

      importCards: async (deckId, cardsData) => {
        const newCards = cardsData.map((row) => ({
          id: generateId(),
          deckId,
          front: row.front || row[0] || '',
          back: row.back || row[1] || '',
          tags: row.tags ? row.tags.split(',').map((t) => t.trim()) : [],
          srsLevel: 0,
          nextReview: new Date().toISOString(),
          lastReviewed: null,
          interval: 0,
          createdAt: new Date().toISOString(),
          reviewCount: 0,
        }))
        set((state) => ({ cards: [...state.cards, ...newCards] }))

        const userId = await getUserId()
        if (userId) {
          await Promise.all(newCards.map((card) => dbUpsertCard(card, userId)))
        }

        return newCards.length
      },

      getStreakDays: () => {
        const state = get()
        const stats = state.dailyStats
        const dates = Object.keys(stats).sort().reverse()
        if (dates.length === 0) return 0

        let streak = 0
        const today = getToday()
        let checkDate = new Date(today)

        for (let i = 0; i < 365; i++) {
          const dateStr = checkDate.toISOString().split('T')[0]
          if (stats[dateStr] && stats[dateStr].reviewed > 0) {
            streak++
            checkDate.setDate(checkDate.getDate() - 1)
          } else if (i === 0) {
            checkDate.setDate(checkDate.getDate() - 1)
            continue
          } else {
            break
          }
        }
        return streak
      },

      getWeeklyStats: () => {
        const state = get()
        const result = []
        const today = new Date()
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today)
          d.setDate(d.getDate() - i)
          const dateStr = d.toISOString().split('T')[0]
          const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
          result.push({
            day: dayNames[d.getDay()],
            date: dateStr,
            reviewed: state.dailyStats[dateStr]?.reviewed || 0,
            correct: state.dailyStats[dateStr]?.correct || 0,
          })
        }
        return result
      },
    }),
    {
      name: 'flashmind-storage',
    }
  )
)

export default useStore
