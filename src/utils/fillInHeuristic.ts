/**
 * Fill-in-the-blank heuristic utilities
 * 
 * Automatically extracts key words from text answers to create blanks for the fill-in learning mode.
 * Uses a multi-criteria scoring system to identify the most important words to hide.
 * 
 * Algorithm Overview:
 * 1. Extracts all words from text using regex (handles apostrophes, hyphens, numbers)
 * 2. Filters out common function words and very short words
 * 3. Scores each remaining word based on multiple weighted factors:
 *    - Proper nouns (weight: 4-6), numbers/dates (3), technical terms (2-3)
 *    - Quoted words (3), acronyms/all-caps (3), position in sentence (0-2)
 *    - Word length bonus (1-2), short word penalty (-1)
 * 4. Selects top-scoring words with minimum distance constraints for optimal distribution
 * 5. Applies progressive fallbacks if insufficient candidates found
 * 6. Special handling for very short answers (1-3 chars): hides entire answer
 * 7. Generates formatted text with numbered blanks (e.g., "___[1]___", "___[2]___")
 * 
 * Architecture note: Designed to be easily replaceable with LLM-based extraction
 * (e.g., WebLLM) in the future for smarter, context-aware word selection.
 */

import { devLog } from './devMode'

export interface BlankWord {
    word: string
    startIndex: number
    endIndex: number
    score?: number // Optional score for debugging
}

export interface FillInResult {
    textWithBlanks: string
    blanks: BlankWord[]
    originalText: string
}

/**
 * Check if a word is a proper noun (starts with capital, not at start of sentence)
 * Handles compound names (e.g., "Uzumaki", "Straw Hat")
 */
function isProperNoun(word: string, isStartOfSentence: boolean, text: string, startIndex: number): boolean {
    // Skip if at start of sentence (could just be capitalized sentence start)
    if (isStartOfSentence) return false
    
    // Check if word starts with capital letter
    if (!/^[A-Z]/.test(word)) return false
    
    // Check if previous word is also capitalized (compound proper noun like "New York")
    const beforeWord = text.slice(Math.max(0, startIndex - 20), startIndex).trim()
    const lastWordBefore = beforeWord.match(/\b([A-Z][a-z]+)\s*$/)
    if (lastWordBefore) {
        // Likely part of a compound proper noun
        return true
    }
    
    // Single capitalized word that's not a common word
    return /^[A-Z][a-z]+$/.test(word)
}

/**
 * Check if a word contains numbers/dates
 */
function containsNumber(word: string): boolean {
    return /\d/.test(word)
}

/**
 * Check if a word is a technical term or uncommon word
 * Uses length and pattern analysis to identify technical terms
 */
function isTechnicalTerm(word: string): boolean {
    // Very long words (8+ chars) are likely technical/important
    if (word.length >= 8) return true
    
    // Words with uncommon patterns (caps in middle, hyphens, etc.)
    if (/[A-Z].*[a-z]/.test(word) && word.length > 4) return true
    if (word.includes('-') && word.length > 5) return true
    
    // Medium-length words (6-7 chars) that aren't common
    if (word.length >= 6 && word.length <= 7) {
        // Check for uncommon letter combinations
        if (/[xzqj][a-z]{2,}/i.test(word)) return true
        return true // Conservative: assume it's important
    }
    
    return false
}

/**
 * Check if a word is quoted
 */
function isQuotedWord(text: string, startIndex: number, endIndex: number): boolean {
    const before = text.slice(Math.max(0, startIndex - 1), startIndex)
    const after = text.slice(endIndex, Math.min(text.length, endIndex + 1))
    return (before === '"' && after === '"') || (before === "'" && after === "'")
}

/**
 * Check if word is in all caps (likely acronym or emphasis)
 */
function isAllCaps(word: string): boolean {
    return /^[A-Z]{2,}$/.test(word) && word.length >= 2
}

/**
 * Calculate word importance based on position in sentence
 * Words in the middle/end are often more important than sentence start
 */
function getPositionScore(startIndex: number, sentenceStart: number, sentenceLength: number): number {
    if (sentenceLength === 0) return 0
    
    const relativePosition = (startIndex - sentenceStart) / sentenceLength
    
    // End of sentence is more important (0.8-1.0)
    if (relativePosition > 0.8) return 2
    // Middle is important (0.4-0.8)
    if (relativePosition > 0.4) return 1
    // Beginning is less important (but still considered)
    return 0
}

/**
 * Check if word appears to be part of a compound expression
 * (e.g., "Straw Hat", "Death Note", "Attack Titan")
 */
function isPartOfCompound(text: string, startIndex: number, endIndex: number): boolean {
    const before = text.slice(Math.max(0, startIndex - 15), startIndex).trim()
    const after = text.slice(endIndex, Math.min(text.length, endIndex + 15)).trim()
    
    // Check if there's a capitalized word before (compound proper noun)
    if (before.match(/\b[A-Z][a-z]+\s+$/)) return true
    
    // Check if there's a capitalized word after (compound proper noun)
    if (after.match(/^\s+[A-Z][a-z]+/)) return true
    
    return false
}

/**
 * Common words that should not be blanked
 * List of common function words and articles
 */
const COMMON_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'it',
    'its', 'their', 'they', 'them', 'he', 'she', 'his', 'her', 'we', 'us',
    'our', 'your', 'you', 'i', 'me', 'my', 'not', 'no', 'yes', 'if', 'when',
    'which', 'who', 'what', 'where', 'why', 'how', 'all', 'each', 'every',
    'both', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'same',
    'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there',
    'then', 'than', 'about', 'into', 'over', 'after', 'during', 'through',
    'while', 'before', 'until', 'since', 'upon', 'within', 'without', 'below',
    'above', 'across', 'around', 'behind', 'beside', 'between', 'beyond'
])

/**
 * Calculate comprehensive score for a word
 * Uses weighted factors to determine word importance
 */
function calculateWordScore(
    word: string,
    text: string,
    startIndex: number,
    endIndex: number,
    isStartOfSentence: boolean,
    sentenceStart: number,
    sentenceLength: number
): number {
    let score = 0
    
    // Proper nouns are highly important (weight: 4)
    if (isProperNoun(word, isStartOfSentence, text, startIndex)) {
        score += 4
        
        // Compound proper nouns are even more important
        if (isPartOfCompound(text, startIndex, endIndex)) {
            score += 2
        }
    }
    
    // Numbers/dates are important (weight: 3)
    if (containsNumber(word)) {
        score += 3
    }
    
    // Technical terms (weight: 2-3 based on length)
    if (isTechnicalTerm(word)) {
        score += word.length >= 8 ? 3 : 2
    }
    
    // Quoted words are important (weight: 3)
    if (isQuotedWord(text, startIndex, endIndex)) {
        score += 3
    }
    
    // All caps words (acronyms, emphasis) (weight: 3)
    if (isAllCaps(word)) {
        score += 3
    }
    
    // Position in sentence (weight: 0-2)
    score += getPositionScore(startIndex, sentenceStart, sentenceLength)
    
    // Length bonus: longer words are often more specific/important (weight: 0-2)
    if (word.length >= 7) score += 2
    else if (word.length >= 5) score += 1
    
    // Penalty for very short words (even if they pass other checks)
    if (word.length <= 3) score -= 1
    
    return score
}

/**
 * Check if a word candidate is too close to already selected words
 * Ensures optimal distribution of blanks across the text
 */
function isTooCloseToSelected(
    candidate: BlankWord,
    selected: BlankWord[],
    minDistance: number = 5
): boolean {
    return selected.some(selectedWord => {
        const distance = Math.abs(candidate.startIndex - selectedWord.startIndex)
        return distance < minDistance
    })
}

/**
 * Extract key words from text using heuristics
 * Returns words that are likely important to remember
 */
export function extractKeyWords(text: string, maxBlanks: number = 3): BlankWord[] {
    if (!text || text.trim().length === 0) {
        devLog.warn('[fillInHeuristic] Empty text provided to extractKeyWords')
        return []
    }
    
    devLog.log('[fillInHeuristic] extractKeyWords called with text:', text.substring(0, 50), 'maxBlanks:', maxBlanks)

    const trimmedText = text.trim()
    
    // Special case: for very short answers (1-3 characters), return empty
    // and let generateFillInBlanks handle it with its fallback
    if (trimmedText.length <= 3) {
        devLog.log('[fillInHeuristic] Very short text detected, delegating to fallback')
        return []
    }

    const wordCandidates: (BlankWord & { score: number })[] = []
    const wordRegex = /\b[a-zA-Z0-9]+(?:[''-][a-zA-Z0-9]+)*\b/g

    // Find sentence boundaries for position scoring
    const sentenceBoundaries: number[] = [0] // Start of first sentence
    for (let i = 0; i < text.length; i++) {
        if (/[.!?]/.test(text[i])) {
            // Skip spaces after punctuation
            let j = i + 1
            while (j < text.length && /\s/.test(text[j])) j++
            if (j < text.length) {
                sentenceBoundaries.push(j)
            }
        }
    }
    sentenceBoundaries.push(text.length) // End of last sentence

    let match
    while ((match = wordRegex.exec(text)) !== null) {
        const word = match[0]
        const startIndex = match.index
        const endIndex = startIndex + word.length

        // Find which sentence this word belongs to
        let sentenceStart = 0
        let sentenceEnd = text.length
        for (let i = 0; i < sentenceBoundaries.length - 1; i++) {
            if (startIndex >= sentenceBoundaries[i] && startIndex < sentenceBoundaries[i + 1]) {
                sentenceStart = sentenceBoundaries[i]
                sentenceEnd = sentenceBoundaries[i + 1]
                break
            }
        }

        const sentenceLength = sentenceEnd - sentenceStart
        const isStartOfSentence = startIndex === sentenceStart || 
            (startIndex > sentenceStart && /[.!?]\s+$/.test(text.slice(sentenceStart, startIndex)))

        // Skip common words
        if (COMMON_WORDS.has(word.toLowerCase())) {
            continue
        }

        // Skip very short words (but not single character words if text is very short)
        // For very short texts, we might want to include even short words
        if (word.length <= 2 && text.trim().split(/\s+/).length > 1) {
            continue
        }

        // Calculate comprehensive score
        const score = calculateWordScore(
            word,
            text,
            startIndex,
            endIndex,
            isStartOfSentence,
            sentenceStart,
            sentenceLength
        )

        // Only add words with positive score
        if (score > 0) {
            wordCandidates.push({
                word,
                startIndex,
                endIndex,
                score
            })
        }
    }

    // Sort by score (highest first)
    wordCandidates.sort((a, b) => b.score - a.score)

    // Select words ensuring minimum distance between them
    const selected: BlankWord[] = []
    const minDistance = Math.max(5, Math.floor(text.length / (maxBlanks * 2))) // Dynamic min distance

    for (const candidate of wordCandidates) {
        if (selected.length >= maxBlanks) break

        // Skip if too close to already selected words
        if (isTooCloseToSelected(candidate, selected, minDistance)) {
            continue
        }

        selected.push({
            word: candidate.word,
            startIndex: candidate.startIndex,
            endIndex: candidate.endIndex
        })
    }

    // If we still don't have enough, relax distance constraint
    if (selected.length < maxBlanks) {
        for (const candidate of wordCandidates) {
            if (selected.length >= maxBlanks) break
            
            // Skip if already selected
            if (selected.some(s => s.startIndex === candidate.startIndex)) {
                continue
            }

            // Accept if not exactly overlapping
            if (!isTooCloseToSelected(candidate, selected, 2)) {
                selected.push({
                    word: candidate.word,
                    startIndex: candidate.startIndex,
                    endIndex: candidate.endIndex
                })
            }
        }
    }

    // Final fallback: if still not enough, add longer words regardless of score
    if (selected.length < maxBlanks) {
        wordRegex.lastIndex = 0
        const additionalWords: BlankWord[] = []

        while ((match = wordRegex.exec(text)) !== null) {
            const word = match[0]
            const startIndex = match.index
            const endIndex = startIndex + word.length

            // Skip if already selected
            if (selected.some(s => s.startIndex === startIndex)) continue

            // Skip common words
            if (COMMON_WORDS.has(word.toLowerCase())) continue

            // Add longer words (5+ chars)
            if (word.length >= 5) {
                additionalWords.push({ word, startIndex, endIndex })
            }
        }

        // Sort by length and add until we have enough
        additionalWords.sort((a, b) => b.word.length - a.word.length)
        for (const word of additionalWords) {
            if (selected.length >= maxBlanks) break
            if (!selected.some(s => s.startIndex === word.startIndex)) {
                selected.push(word)
            }
        }
    }

    // Sort by position (left to right) for consistent display
    const result = selected
        .sort((a, b) => a.startIndex - b.startIndex)
        .slice(0, maxBlanks)
    
    devLog.log('[fillInHeuristic] extractKeyWords result:', result.map(r => r.word), 'from text:', text.substring(0, 50))
    
    return result
}

/**
 * Generate fill-in-the-blank text from original answer
 */
export function generateFillInBlanks(text: string, maxBlanks: number = 3): FillInResult {
    if (!text || text.trim().length === 0) {
        return {
            textWithBlanks: '',
            blanks: [],
            originalText: text
        }
    }

    const blanks = extractKeyWords(text, maxBlanks)

    // Fallback: if no blanks found, handle various cases
    if (blanks.length === 0) {
        devLog.log('[fillInHeuristic] No blanks found, using fallback for text:', text)
        const trimmedText = text.trim()
        
        // For very short answers (1-3 chars), hide the entire answer
        if (trimmedText.length <= 3 && trimmedText.length > 0) {
            devLog.log('[fillInHeuristic] Very short text detected, hiding entire answer')
            // Find the first non-space character
            const firstCharMatch = text.match(/\S/)
            if (firstCharMatch && firstCharMatch.index !== undefined) {
                const startIndex = firstCharMatch.index
                // Find where the word/answer ends (non-space sequence)
                let endIndex = startIndex
                while (endIndex < text.length && /\S/.test(text[endIndex])) {
                    endIndex++
                }
                const hiddenWord = text.slice(startIndex, endIndex)
                devLog.log('[fillInHeuristic] Fallback: hiding word:', hiddenWord, 'at index', startIndex, '-', endIndex)
                blanks.push({
                    word: hiddenWord,
                    startIndex,
                    endIndex
                })
            }
        } else {
            // For longer texts, try to find any significant word (4+ chars)
            const match = text.match(/\b[a-zA-Z]{4,}\b/)
            if (match && match.index !== undefined) {
                blanks.push({
                    word: match[0],
                    startIndex: match.index,
                    endIndex: match.index + match[0].length
                })
            } else {
                // Last resort: find any word with 3+ chars
                const match3 = text.match(/\b[a-zA-Z]{3,}\b/)
                if (match3 && match3.index !== undefined) {
                    blanks.push({
                        word: match3[0],
                        startIndex: match3.index,
                        endIndex: match3.index + match3[0].length
                    })
                } else {
                    // Final fallback: hide the first non-space sequence
                    const firstNonSpace = text.match(/\S+/)
                    if (firstNonSpace && firstNonSpace.index !== undefined) {
                        blanks.push({
                            word: firstNonSpace[0],
                            startIndex: firstNonSpace.index,
                            endIndex: firstNonSpace.index + firstNonSpace[0].length
                        })
                    }
                }
            }
        }
    }

    // Build the text with blanks
    let textWithBlanks = ''
    let lastIndex = 0

    blanks.forEach((blank, index) => {
        textWithBlanks += text.slice(lastIndex, blank.startIndex)
        // Use underscores to indicate blank length, with a number
        textWithBlanks += `___[${index + 1}]___`
        lastIndex = blank.endIndex
    })

    textWithBlanks += text.slice(lastIndex)

    devLog.log('[fillInHeuristic] generateFillInBlanks result:', {
        textWithBlanks,
        blanksCount: blanks.length,
        blanks: blanks.map(b => b.word)
    })

    return {
        textWithBlanks,
        blanks,
        originalText: text
    }
}