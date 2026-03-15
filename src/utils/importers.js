import Papa from 'papaparse'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cards = results.data.map((row) => {
          const keys = Object.keys(row)
          return {
            front: row.front || row.Front || row.pregunta || row.Pregunta || row[keys[0]] || '',
            back: row.back || row.Back || row.respuesta || row.Respuesta || row[keys[1]] || '',
            tags: row.tags || row.Tags || row.etiquetas || '',
          }
        }).filter((c) => c.front && c.back)
        resolve(cards)
      },
      error: (err) => reject(err),
    })
  })
}

export async function parseAPKG(file) {
  // APKG files are SQLite databases inside a ZIP
  // We'll use a simplified approach: read the ZIP, extract the SQLite DB,
  // and parse the notes table
  const JSZip = (await import('jszip')).default
  const initSqlJs = (await import('sql.js')).default

  const zip = await JSZip.loadAsync(file)
  const dbFile = zip.file('collection.anki2') || zip.file('collection.anki21')

  if (!dbFile) {
    throw new Error('No se encontró la base de datos en el archivo .apkg')
  }

  const dbBuffer = await dbFile.async('arraybuffer')
  const SQL = await initSqlJs({
    locateFile: () => sqlWasmUrl,
  })
  const db = new SQL.Database(new Uint8Array(dbBuffer))

  const results = db.exec('SELECT flds FROM notes')
  if (!results.length) return []

  const cards = results[0].values.map((row) => {
    const fields = row[0].split('\x1f')
    return {
      front: fields[0]?.replace(/<[^>]*>/g, '') || '',
      back: fields[1]?.replace(/<[^>]*>/g, '') || '',
      tags: '',
    }
  }).filter((c) => c.front && c.back)

  db.close()
  return cards
}
