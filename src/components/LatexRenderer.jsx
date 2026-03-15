import { useMemo } from 'react'
import katex from 'katex'

/**
 * Renderiza texto que puede contener LaTeX.
 * Formatos soportados:
 *  - Display: $$...$$  (bloque centrado)
 *  - Inline:  $...$    (dentro del texto)
 *
 * Si el texto no tiene LaTeX, se renderiza como texto normal.
 */
function renderLatex(text) {
  if (!text) return []

  // Regex que detecta $$...$$ primero (display), luego $...$ (inline)
  const TOKEN_RE = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g

  const parts = []
  let lastIndex = 0
  let match

  while ((match = TOKEN_RE.exec(text)) !== null) {
    // Texto antes del token LaTeX
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }

    const token = match[0]
    const isDisplay = token.startsWith('$$')
    const formula = isDisplay ? token.slice(2, -2) : token.slice(1, -1)

    try {
      const html = katex.renderToString(formula.trim(), {
        displayMode: isDisplay,
        throwOnError: false,
        output: 'html',
      })
      parts.push({ type: 'latex', isDisplay, html })
    } catch {
      // Si falla, mostrar el token original
      parts.push({ type: 'text', content: token })
    }

    lastIndex = TOKEN_RE.lastIndex
  }

  // Resto del texto después del último token
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return parts
}

export default function LatexRenderer({ text, className = '' }) {
  const parts = useMemo(() => renderLatex(text), [text])

  if (parts.length === 0) return null

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return <span key={i}>{part.content}</span>
        }
        if (part.isDisplay) {
          return (
            <span
              key={i}
              className="block text-center my-3"
              dangerouslySetInnerHTML={{ __html: part.html }}
            />
          )
        }
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: part.html }}
          />
        )
      })}
    </span>
  )
}
