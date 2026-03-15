import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload,
  FileText,
  Package,
  Check,
  AlertCircle,
  ArrowRight,
  Plus,
  X,
} from 'lucide-react'
import useStore from '../store/useStore'
import { parseCSV, parseAPKG } from '../utils/importers'

export default function Import() {
  const navigate = useNavigate()
  const { decks, addDeck, importCards } = useStore()
  const fileInputRef = useRef(null)

  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [targetDeck, setTargetDeck] = useState('')
  const [newDeckName, setNewDeckName] = useState('')
  const [showNewDeck, setShowNewDeck] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'success'|'error', message, count }
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFile = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['csv', 'tsv', 'txt', 'apkg'].includes(ext)) {
      setStatus({ type: 'error', message: 'Formato no soportado. Usa archivos .csv o .apkg' })
      return
    }

    setSelectedFile(file)
    setFileType(ext === 'apkg' ? 'apkg' : 'csv')
    setStatus(null)

    // Preview first few cards
    try {
      let parsed
      if (ext === 'apkg') {
        parsed = await parseAPKG(file)
      } else {
        parsed = await parseCSV(file)
      }
      setPreview(parsed.slice(0, 5))
    } catch {
      setPreview(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleImport = async () => {
    if (!selectedFile) return

    let deckId = targetDeck
    if (showNewDeck && newDeckName.trim()) {
      deckId = addDeck(newDeckName.trim())
    }

    if (!deckId) {
      setStatus({ type: 'error', message: 'Selecciona o crea un mazo primero' })
      return
    }

    setLoading(true)
    try {
      let parsed
      if (fileType === 'apkg') {
        parsed = await parseAPKG(selectedFile)
      } else {
        parsed = await parseCSV(selectedFile)
      }

      if (parsed.length === 0) {
        setStatus({ type: 'error', message: 'No se encontraron tarjetas en el archivo' })
        setLoading(false)
        return
      }

      const count = importCards(deckId, parsed)
      setStatus({ type: 'success', message: `${count} tarjetas importadas correctamente`, count })
      setSelectedFile(null)
      setPreview(null)
    } catch (err) {
      setStatus({ type: 'error', message: `Error al importar: ${err.message}` })
    }
    setLoading(false)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Importar tarjetas</h1>
        <p className="text-sm text-surface-200/50 mt-1">
          Importa desde archivos CSV o paquetes Anki (.apkg)
        </p>
      </div>

      {/* Supported formats */}
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <div className="bg-surface-900/60 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-success-400/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-success-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">CSV / TSV</h3>
              <p className="text-[11px] text-surface-200/40">Archivos separados por comas</p>
            </div>
          </div>
          <p className="text-xs text-surface-200/40 leading-relaxed">
            Columnas: <code className="text-primary-400/70">front</code>, <code className="text-primary-400/70">back</code>, <code className="text-primary-400/70">tags</code> (opcional)
          </p>
        </div>
        <div className="bg-surface-900/60 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-400/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Anki Package</h3>
              <p className="text-[11px] text-surface-200/40">Archivos .apkg exportados de Anki</p>
            </div>
          </div>
          <p className="text-xs text-surface-200/40 leading-relaxed">
            Extrae las notas directamente de la base de datos de Anki
          </p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-primary-500/50 bg-primary-500/5'
            : selectedFile
            ? 'border-success-400/30 bg-success-400/5'
            : 'border-white/10 hover:border-white/20 bg-surface-900/30'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,.txt,.apkg"
          className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success-400/10 flex items-center justify-center">
              <Check className="w-6 h-6 text-success-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{selectedFile.name}</p>
              <p className="text-xs text-surface-200/40 mt-1">
                {(selectedFile.size / 1024).toFixed(1)} KB - {fileType?.toUpperCase()}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedFile(null)
                setPreview(null)
              }}
              className="text-xs text-surface-200/40 hover:text-surface-200/60"
            >
              Cambiar archivo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-10 h-10 text-surface-200/20" />
            <div>
              <p className="text-sm text-surface-200/50">
                Arrastra un archivo aquí o <span className="text-primary-400">haz clic para seleccionar</span>
              </p>
              <p className="text-xs text-surface-200/30 mt-1">.csv, .tsv, .apkg</p>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {preview && preview.length > 0 && (
        <div className="mt-6 bg-surface-900/40 border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Vista previa ({preview.length} primeras)</h3>
          <div className="space-y-2">
            {preview.map((card, i) => (
              <div key={i} className="flex gap-4 py-2 border-b border-white/5 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-surface-200/30">Frente</p>
                  <p className="text-sm text-white truncate">{card.front}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-surface-200/30">Reverso</p>
                  <p className="text-sm text-surface-200/70 truncate">{card.back}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deck selection */}
      {selectedFile && (
        <div className="mt-6 bg-surface-900/40 border border-white/5 rounded-2xl p-5 animate-slide-up">
          <h3 className="text-sm font-semibold text-white mb-4">Destino</h3>

          {!showNewDeck ? (
            <div className="space-y-3">
              <select
                value={targetDeck}
                onChange={(e) => setTargetDeck(e.target.value)}
                className="w-full bg-surface-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
              >
                <option value="">Seleccionar mazo...</option>
                {decks.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowNewDeck(true)}
                className="flex items-center gap-2 text-xs text-primary-400 hover:text-primary-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Crear mazo nuevo
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                placeholder="Nombre del nuevo mazo"
                className="w-full bg-surface-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500/50"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowNewDeck(false)
                  setNewDeckName('')
                }}
                className="text-xs text-surface-200/40 hover:text-surface-200/60"
              >
                Usar mazo existente
              </button>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={loading || (!targetDeck && !newDeckName.trim())}
            className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white text-sm font-semibold rounded-xl disabled:opacity-40 shadow-lg shadow-primary-500/20 transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Importar tarjetas
              </>
            )}
          </button>
        </div>
      )}

      {/* Status message */}
      {status && (
        <div
          className={`mt-6 flex items-center gap-3 p-4 rounded-xl animate-slide-up ${
            status.type === 'success'
              ? 'bg-success-400/10 border border-success-400/20'
              : 'bg-danger-400/10 border border-danger-400/20'
          }`}
        >
          {status.type === 'success' ? (
            <Check className="w-5 h-5 text-success-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-danger-400 shrink-0" />
          )}
          <p className={`text-sm flex-1 ${status.type === 'success' ? 'text-success-400' : 'text-danger-400'}`}>
            {status.message}
          </p>
          {status.type === 'success' && (
            <button
              onClick={() => navigate('/glossary')}
              className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 font-medium shrink-0"
            >
              Ver tarjetas <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
