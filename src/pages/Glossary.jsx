import { useState, useMemo } from 'react'
import LatexRenderer from '../components/LatexRenderer'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Layers,
  X,
  Check,
  Play,
  Tag,
} from 'lucide-react'
import useStore from '../store/useStore'

function EditCardModal({ card, onClose }) {
  const [front, setFront] = useState(card.front)
  const [back, setBack] = useState(card.back)
  const [tags, setTags] = useState(card.tags?.join(', ') || '')
  const { updateCard } = useStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!front.trim() || !back.trim()) return
    updateCard(card.id, {
      front: front.trim(),
      back: back.trim(),
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-500/15 flex items-center justify-center">
              <Edit3 className="w-3.5 h-3.5 text-primary-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Editar tarjeta</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-surface-200/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-surface-200/50 mb-1.5 block">
              Frente (Pregunta)
            </label>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              rows={3}
              className="w-full bg-surface-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50 resize-none"
              autoFocus
            />
            {front && (
              <div className="mt-1.5 px-3 py-2 bg-surface-800/40 rounded-lg border border-white/5">
                <p className="text-[10px] text-surface-200/30 mb-1 uppercase tracking-wider">Vista previa</p>
                <p className="text-xs text-surface-200/70"><LatexRenderer text={front} /></p>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-surface-200/50 mb-1.5 block">
              Reverso (Respuesta)
            </label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={3}
              className="w-full bg-surface-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50 resize-none"
            />
            {back && (
              <div className="mt-1.5 px-3 py-2 bg-surface-800/40 rounded-lg border border-white/5">
                <p className="text-[10px] text-surface-200/30 mb-1 uppercase tracking-wider">Vista previa</p>
                <p className="text-xs text-surface-200/70"><LatexRenderer text={back} /></p>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-surface-200/50 mb-1.5 block">
              Etiquetas (separadas por coma)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ej: álgebra, cálculo"
              className="w-full bg-surface-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={!front.trim() || !back.trim()}
              className="flex-1 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-primary-500/20"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white/5 text-surface-200/70 text-sm font-medium rounded-xl hover:bg-white/10 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CreateDeckModal({ onClose }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { addDeck } = useStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    addDeck(name.trim(), description.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-md p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Nuevo mazo</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
            <X className="w-4 h-4 text-surface-200/60" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-surface-200/50 mb-1.5 block">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Vocabulario Inglés"
              className="w-full bg-surface-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-surface-200/50 mb-1.5 block">Descripción (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el contenido de este mazo..."
              rows={2}
              className="w-full bg-surface-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl disabled:opacity-40 transition-all"
          >
            Crear mazo
          </button>
        </form>
      </div>
    </div>
  )
}

function AddCardModal({ deckId, onClose }) {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [tags, setTags] = useState('')
  const { addCard } = useStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!front.trim() || !back.trim()) return
    addCard(deckId, front.trim(), back.trim(), tags ? tags.split(',').map((t) => t.trim()) : [])
    setFront('')
    setBack('')
    setTags('')
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-md p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Nueva tarjeta</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
            <X className="w-4 h-4 text-surface-200/60" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-surface-200/50 mb-1.5 block">Frente (Pregunta)</label>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Escribe la pregunta..."
              rows={3}
              className="w-full bg-surface-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50 resize-none"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-surface-200/50 mb-1.5 block">Reverso (Respuesta)</label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Escribe la respuesta..."
              rows={3}
              className="w-full bg-surface-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-surface-200/50 mb-1.5 block">Etiquetas (separadas por coma)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ej: gramática, verbos"
              className="w-full bg-surface-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!front.trim() || !back.trim()}
              className="flex-1 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl disabled:opacity-40 transition-all"
            >
              Agregar y continuar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white/5 text-surface-200/70 text-sm font-medium rounded-xl hover:bg-white/10 transition-all"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CardRow({ card, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false)

  const levelColors = ['text-surface-200/40', 'text-danger-400', 'text-warning-400', 'text-success-400', 'text-primary-400', 'text-accent-400', 'text-primary-300', 'text-success-300']

  return (
    <div className="bg-surface-900/40 border border-white/5 rounded-xl hover:border-white/10 transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white truncate"><LatexRenderer text={card.front} /></p>
          {!expanded && (
            <p className="text-xs text-surface-200/40 truncate mt-0.5"><LatexRenderer text={card.back} /></p>
          )}
        </div>
        <span className={`text-[10px] font-semibold ${levelColors[card.srsLevel] || levelColors[0]}`}>
          Nivel {card.srsLevel}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-surface-200/30 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-surface-200/30 shrink-0" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-white/5 animate-fade-in">
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-[10px] font-medium text-surface-200/30 uppercase tracking-wider">Respuesta</p>
              <p className="text-sm text-surface-200/80 mt-1"><LatexRenderer text={card.back} /></p>
            </div>
            {card.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {card.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-accent-500/10 text-accent-400 text-[10px] font-medium rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
              <span className="text-[10px] text-surface-200/30">
                Repasos: {card.reviewCount || 0}
              </span>
              <span className="text-surface-200/10">|</span>
              <span className="text-[10px] text-surface-200/30">
                Intervalo: {card.interval || 0}d
              </span>
              <div className="flex-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(card)
                }}
                className="w-7 h-7 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 flex items-center justify-center transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-primary-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(card.id)
                }}
                className="w-7 h-7 rounded-lg bg-danger-500/10 hover:bg-danger-500/20 flex items-center justify-center transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 text-danger-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Glossary() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { decks, cards, getDeckStats, deleteDeck, deleteCard } = useStore()

  const [search, setSearch] = useState('')
  const [selectedDeck, setSelectedDeck] = useState(searchParams.get('deck') || '')
  const [showCreateDeck, setShowCreateDeck] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [editingCard, setEditingCard] = useState(null)

  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      if (selectedDeck && c.deckId !== selectedDeck) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          c.front.toLowerCase().includes(q) ||
          c.back.toLowerCase().includes(q) ||
          c.tags?.some((t) => t.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [cards, selectedDeck, search])

  const selectedDeckData = decks.find((d) => d.id === selectedDeck)

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Glosario</h1>
          <p className="text-sm text-surface-200/50 mt-1">
            Gestiona tus mazos y tarjetas
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateDeck(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-surface-200/70 text-sm font-medium rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Mazo
          </button>
          {selectedDeck && (
            <button
              onClick={() => setShowAddCard(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Tarjeta
            </button>
          )}
        </div>
      </div>

      {/* Deck tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedDeck('')}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${!selectedDeck
            ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
            : 'bg-white/5 text-surface-200/50 border border-transparent hover:bg-white/10'
            }`}
        >
          Todos ({cards.length})
        </button>
        {decks.map((deck) => {
          const stats = getDeckStats(deck.id)
          return (
            <button
              key={deck.id}
              onClick={() => setSelectedDeck(deck.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${selectedDeck === deck.id
                ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                : 'bg-white/5 text-surface-200/50 border border-transparent hover:bg-white/10'
                }`}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: deck.color }} />
              {deck.name} ({stats.total})
            </button>
          )
        })}
      </div>

      {/* Deck info bar */}
      {selectedDeckData && (
        <div className="flex items-center justify-between bg-surface-900/40 border border-white/5 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${selectedDeckData.color}20` }}>
              <Layers className="w-4 h-4" style={{ color: selectedDeckData.color }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{selectedDeckData.name}</h3>
              {selectedDeckData.description && (
                <p className="text-xs text-surface-200/40">{selectedDeckData.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/review?deck=${selectedDeck}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 text-primary-400 text-xs font-medium rounded-lg hover:bg-primary-500/20 transition-all"
            >
              <Play className="w-3 h-3" /> Repasar
            </button>
            <button
              onClick={() => {
                if (window.confirm('¿Eliminar este mazo y todas sus tarjetas?')) {
                  deleteDeck(selectedDeck)
                  setSelectedDeck('')
                }
              }}
              className="w-8 h-8 rounded-lg bg-danger-500/10 hover:bg-danger-500/20 flex items-center justify-center transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 text-danger-400" />
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar tarjetas..."
          className="w-full bg-surface-900/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/30"
        />
      </div>

      {/* Cards list */}
      <div className="space-y-2">
        {filteredCards.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-10 h-10 text-surface-200/15 mx-auto mb-3" />
            <p className="text-sm text-surface-200/40">
              {search ? 'No se encontraron tarjetas' : 'No hay tarjetas en este mazo'}
            </p>
          </div>
        ) : (
          filteredCards.map((card) => (
            <CardRow key={card.id} card={card} onDelete={deleteCard} onEdit={setEditingCard} />
          ))
        )}
      </div>

      <div className="mt-4 text-xs text-surface-200/30 text-center">
        {filteredCards.length} tarjeta{filteredCards.length !== 1 ? 's' : ''}
      </div>

      {showCreateDeck && <CreateDeckModal onClose={() => setShowCreateDeck(false)} />}
      {showAddCard && selectedDeck && (
        <AddCardModal deckId={selectedDeck} onClose={() => setShowAddCard(false)} />
      )}
      {editingCard && (
        <EditCardModal card={editingCard} onClose={() => setEditingCard(null)} />
      )}
    </div>
  )
}
