import { useRef, useState } from 'preact/hooks'
import { db } from '../../models/db'
import { getDefaultSM2Data } from '../../utils/sm2'
import { Icon } from '../shared/Icon'

interface ImportCardsModalContentProps {
  listId: number
  onSuccess: (count: number) => void
  onCancel: () => void
}

interface ParsedCard {
  question: string
  answer: string
  valid: boolean
}

type ImportFormat = 'auto' | 'csv' | 'json' | 'tsv'

export function ImportCardsModalContent({
  listId,
  onSuccess,
  onCancel,
}: ImportCardsModalContentProps) {
  const [content, setContent] = useState('')
  const [parsedCards, setParsedCards] = useState<ParsedCard[]>([])
  const [format, setFormat] = useState<ImportFormat>('auto')
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Parse content based on format
  const parseContent = (
    text: string,
    selectedFormat: ImportFormat,
  ): ParsedCard[] => {
    if (!text.trim()) return []

    const lines = text.trim().split('\n')
    const cards: ParsedCard[] = []

    // Auto-detect format
    let detectedFormat = selectedFormat
    if (selectedFormat === 'auto') {
      if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
        detectedFormat = 'json'
      } else if (lines[0]?.includes('\t')) {
        detectedFormat = 'tsv'
      } else {
        detectedFormat = 'csv'
      }
    }

    try {
      if (detectedFormat === 'json') {
        const parsed = JSON.parse(text)
        const items = Array.isArray(parsed) ? parsed : [parsed]
        for (const item of items) {
          const question = item.question || item.q || item.front || ''
          const answer =
            item.answer || item.a || item.back || item.response || ''
          cards.push({
            question: question.toString().trim(),
            answer: answer.toString().trim(),
            valid: Boolean(question && answer),
          })
        }
      } else {
        // CSV or TSV
        const separator = detectedFormat === 'tsv' ? '\t' : /[;,]/

        for (const line of lines) {
          if (!line.trim()) continue

          // Skip header line if detected
          const lowerLine = line.toLowerCase()
          if (
            lowerLine.includes('question') &&
            (lowerLine.includes('answer') || lowerLine.includes('response'))
          ) {
            continue
          }

          const parts = line.split(separator)
          if (parts.length >= 2) {
            const question = parts[0].trim().replace(/^["']|["']$/g, '')
            const answer = parts
              .slice(1)
              .join(detectedFormat === 'tsv' ? '\t' : ',')
              .trim()
              .replace(/^["']|["']$/g, '')
            cards.push({
              question,
              answer,
              valid: Boolean(question && answer),
            })
          } else if (parts.length === 1 && parts[0].trim()) {
            cards.push({
              question: parts[0].trim(),
              answer: '',
              valid: false,
            })
          }
        }
      }
    } catch {
      setError('Invalid format. Please check the content.')
      return []
    }

    return cards
  }

  const handleContentChange = (text: string) => {
    setContent(text)
    setError('')
    const cards = parseContent(text, format)
    setParsedCards(cards)
  }

  const handleFormatChange = (newFormat: ImportFormat) => {
    setFormat(newFormat)
    if (content) {
      const cards = parseContent(content, newFormat)
      setParsedCards(cards)
    }
  }

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['csv', 'json', 'txt', 'tsv'].includes(ext || '')) {
      setError(
        'Unsupported file format. Please use CSV, JSON, TSV or TXT.',
      )
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      handleContentChange(text)
    }
    reader.readAsText(file)
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer?.files[0]
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (!['csv', 'json', 'txt', 'tsv'].includes(ext || '')) {
        setError(
          'Unsupported file format. Please use CSV, JSON, TSV or TXT.',
        )
        return
      }
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        handleContentChange(text)
      }
      reader.readAsText(file)
    }
  }

  const handleImport = async () => {
    const validCards = parsedCards.filter((c) => c.valid)
    if (validCards.length === 0) {
      setError('No valid cards to import.')
      return
    }

    setIsImporting(true)
    setError('')

    try {
      const cardsToAdd = validCards.map((card) => ({
        question: card.question,
        answer: card.answer,
        listId,
        ...getDefaultSM2Data(),
      }))

      await db.cards.bulkAdd(cardsToAdd)
      onSuccess(validCards.length)
    } catch {
      setError('Error during import. Please try again.')
      setIsImporting(false)
    }
  }

  const validCount = parsedCards.filter((c) => c.valid).length
  const invalidCount = parsedCards.filter((c) => !c.valid).length

  return (
    <div class="space-y-4">
      {/* Format selector */}
      <div>
        <label class="label">Format</label>
        <div class="flex flex-wrap gap-2">
          {(['auto', 'csv', 'json', 'tsv'] as ImportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFormatChange(f)}
              class={`rounded-md px-3 py-1 text-sm font-medium transition-all duration-fast ${
                format === f
                  ? 'bg-brand-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {f === 'auto' ? 'Auto-detect' : f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        class="cursor-pointer rounded-lg border-2 border-dashed border-brand-200 bg-brand-50/50 p-6 text-center transition-colors duration-fast hover:border-brand-400 hover:bg-brand-50"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div class="icon-container-md mx-auto mb-3 rounded-lg bg-brand-100">
          <Icon name="import" size={24} color="#0ea5e9" />
        </div>
        <p class="text-sm text-neutral-600">
          Drag a file here or{' '}
          <span class="font-medium text-brand-600">click to browse</span>
        </p>
        <p class="mt-1 text-xs text-neutral-400">CSV, JSON, TSV ou TXT</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json,.txt,.tsv"
          onChange={handleFileChange}
          class="hidden"
        />
      </div>

      {fileName && (
        <div class="flex items-center gap-2 rounded-md bg-neutral-50 px-3 py-2">
          <Icon name="folder" size={16} color="#78716c" />
          <span class="text-sm text-neutral-600">{fileName}</span>
        </div>
      )}

      {/* Text area for paste/edit */}
      <div>
        <label class="label">Or paste your data here</label>
        <textarea
          value={content}
          onInput={(e) => handleContentChange(e.currentTarget.value)}
          placeholder={`Examples of accepted formats:

CSV: question;answer
Capital of France;Paris
Largest ocean;Pacific

JSON: [{"question": "...", "answer": "..."}]

TSV: question[TAB]answer`}
          class="input min-h-[120px] resize-none font-mono text-sm"
          rows={5}
        />
      </div>

      {/* Preview */}
      {parsedCards.length > 0 && (
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-medium text-neutral-700">
              Preview ({validCount} valid card{validCount > 1 ? 's' : ''})
            </h4>
            {invalidCount > 0 && (
              <span class="text-xs text-warning">
                {invalidCount} line{invalidCount > 1 ? 's' : ''} ignored
              </span>
            )}
          </div>
          <div class="max-h-48 overflow-y-auto rounded-md border border-neutral-200">
            <table class="w-full text-sm">
              <thead class="sticky top-0 bg-neutral-50">
                <tr>
                  <th class="px-3 py-2 text-left font-medium text-neutral-600">
                    Question
                  </th>
                  <th class="px-3 py-2 text-left font-medium text-neutral-600">
                    Answer
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100">
                {parsedCards.slice(0, 10).map((card, i) => (
                  <tr
                    key={i}
                    class={card.valid ? '' : 'bg-warning-light text-warning'}
                  >
                    <td
                      class="max-w-[200px] truncate px-3 py-2"
                      title={card.question}
                    >
                      {card.question || (
                        <span class="italic text-neutral-400">Empty</span>
                      )}
                    </td>
                    <td
                      class="max-w-[200px] truncate px-3 py-2"
                      title={card.answer}
                    >
                      {card.answer || (
                        <span class="italic text-neutral-400">Empty</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedCards.length > 10 && (
              <div class="bg-neutral-50 px-3 py-2 text-center text-xs text-neutral-500">
                And {parsedCards.length - 10} more card
                {parsedCards.length - 10 > 1 ? 's' : ''}...
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p class="text-sm text-error">{error}</p>}

      {/* Actions */}
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} class="btn-ghost">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={isImporting || validCount === 0}
          class="btn-primary"
        >
          {isImporting
            ? 'Importing...'
            : `Import ${validCount} card${validCount > 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  )
}
