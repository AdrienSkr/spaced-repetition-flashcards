/**
 * String similarity utilities using Levenshtein distance
 * Used for tolerance-based answer validation
 */

/**
 * Calculate the Levenshtein distance between two strings
 * This is the minimum number of single-character edits needed to change one string into the other
 */
export function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = []

    // If one string is empty, the distance is the length of the other
    if (a.length === 0) return b.length
    if (b.length === 0) return a.length

    // Initialize the matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i]
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j
    }

    // Fill the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1]
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                )
            }
        }
    }

    return matrix[b.length][a.length]
}

/**
 * Calculate similarity score between two strings (0 to 1)
 * 1 = identical, 0 = completely different
 */
export function getSimilarityScore(a: string, b: string): number {
    const aLower = a.toLowerCase()
    const bLower = b.toLowerCase()
    
    if (aLower === bLower) return 1
    if (a.length === 0 || b.length === 0) return 0

    const distance = levenshteinDistance(aLower, bLower)
    const maxLength = Math.max(a.length, b.length)

    return 1 - (distance / maxLength)
}

/**
 * Tolerance thresholds for each level
 */
export const TOLERANCE_THRESHOLDS = {
    exact: 1.0,      // 100% match required
    tolerant80: 0.8, // 80% similarity
    tolerant60: 0.6, // 60% similarity
} as const

/**
 * Check if an answer is correct based on tolerance level
 */
export function isAnswerCorrect(
    input: string,
    expected: string,
    toleranceLevel: 'exact' | 'tolerant80' | 'tolerant60' = 'exact'
): boolean {
    const inputTrimmed = input.trim().toLowerCase()
    const expectedTrimmed = expected.trim().toLowerCase()

    // Exact match - quick check
    if (inputTrimmed === expectedTrimmed) {
        return true
    }

    // For exact tolerance, no fuzzy matching
    if (toleranceLevel === 'exact') {
        return false
    }

    // Calculate similarity and compare against threshold
    const similarity = getSimilarityScore(inputTrimmed, expectedTrimmed)
    const threshold = TOLERANCE_THRESHOLDS[toleranceLevel]

    return similarity >= threshold
}

/**
 * Get human-readable description of tolerance level
 */
export function getToleranceDescription(level: 'exact' | 'tolerant80' | 'tolerant60'): { label: string; description: string } {
    switch (level) {
        case 'exact':
            return { label: '100%', description: 'Exact match required' }
        case 'tolerant80':
            return { label: '80%', description: 'Minor typos allowed' }
        case 'tolerant60':
            return { label: '60%', description: 'Very lenient (vocabulary)' }
    }
}
