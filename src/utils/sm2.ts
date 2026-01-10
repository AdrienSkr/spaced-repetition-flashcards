/**
 * SM-2 (SuperMemo 2) Spaced Repetition Algorithm
 * 
 * This is a proven algorithm for optimal learning through spaced repetition.
 * It calculates the optimal interval between reviews based on:
 * - How well you remembered the answer (quality 0-5)
 * - Previous repetitions and intervals
 * - An "easiness factor" that adapts to each card
 * 
 * Quality ratings (standard SM-2 scale):
 * 0 - Complete blackout, no memory
 * 1 - Incorrect, but recognized answer when shown
 * 2 - Incorrect, but answer seemed easy to recall
 * 3 - Correct with serious difficulty
 * 4 - Correct with some hesitation
 * 5 - Perfect response, instant recall
 * 
 * Quality calculation by learning mode:
 * 
 * Typing mode (based on response time):
 * - Wrong answer = quality 1
 * - Correct answer (slow, >8s) = quality 3
 * - Correct answer (good, 3-8s) = quality 4
 * - Perfect (fast, <3s) = quality 5
 * 
 * Swipe mode (binary self-assessment):
 * - User didn't know it = quality 1
 * - User knew it (swiped correctly) = quality 5
 * This mode trusts the user's self-assessment completely
 * 
 * Fill-in mode (based on percentage of correct blanks):
 * - All wrong = quality 1
 * - Some correct (<50%) = quality 2
 * - Half or more correct (50-79%) = quality 3
 * - Most correct (80-99%) = quality 4
 * - All blanks correct (100%) = quality 5
 */

export interface SM2CardData {
    repetitions: number // Number of consecutive correct responses
    easinessFactor: number // Easiness Factor - how easy the card is (default 2.5)
    interval: number // Current interval in days until next review
    nextReview: number // Timestamp of next scheduled review
    lastReviewed: number // Timestamp of last review
    totalReviews: number // Total number of reviews
    correctStreak: number // Current streak of correct answers
}

export interface SM2Result {
    repetitions: number
    easinessFactor: number
    interval: number
    nextReview: number
}

// Default SM2 data for new cards
export function getDefaultSM2Data(): SM2CardData {
    return {
        repetitions: 0,
        easinessFactor: 2.5,
        interval: 0,
        nextReview: Date.now(),
        lastReviewed: 0,
        totalReviews: 0,
        correctStreak: 0,
    }
}

/**
 * Calculate the next review using SM-2 algorithm
 * 
 * @param quality - Rating from 0-5 (0=complete fail, 5=perfect)
 * @param repetitions - Number of consecutive correct responses
 * @param easinessFactor - Current easiness factor (default 2.5)
 * @param interval - Current interval in days
 * @returns Updated SM2 result with new interval and next review date
 */
export function calculateSM2(
    quality: number,
    repetitions: number,
    easinessFactor: number,
    interval: number
): SM2Result {
    quality = Math.max(0, Math.min(5, quality)) // Ensure quality is within bounds

    // Calculate new easiness factor
    let newEF = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

    // Easiness factor should not go below 1.3
    newEF = Math.max(1.3, newEF)

    let newRepetitions: number
    let newInterval: number

    if (quality < 3) {
        // Failed response - reset repetitions
        newRepetitions = 0
        newInterval = 1 // Review again in 1 day
    } else {
        // Successful response
        newRepetitions = repetitions + 1

        if (newRepetitions === 1) {
            newInterval = 1 // First successful review: 1 day
        } else if (newRepetitions === 2) {
            newInterval = 6 // Second successful review: 6 days
        } else {
            // Subsequent reviews: interval * easiness factor
            newInterval = Math.round(interval * newEF)
        }
    }

    // Calculate next review timestamp
    const nextReview = Date.now() + newInterval * 24 * 60 * 60 * 1000

    return {
        repetitions: newRepetitions,
        easinessFactor: newEF,
        interval: newInterval,
        nextReview,
    }
}

/**
 * Learning mode types supported by the SM-2 algorithm
 * 
 * Each mode uses different criteria to calculate quality ratings:
 * - 'typing': User types the answer, quality based on response time
 * - 'swipe': User swipes to indicate if they knew the answer (binary self-assessment)
 * - 'fillIn': User fills in blanks in the answer, quality based on percentage of correct blanks
 */
export type LearningModeType = 'typing' | 'swipe' | 'fillIn'

/**
 * Answer data specific to each mode
 */
export interface ModeAnswerData {
    isCorrect: boolean
    // Typing mode - response time in ms
    responseTimeMs?: number
    // Fill-in mode - number of correct blanks vs total
    correctBlanks?: number
    totalBlanks?: number
}

/**
 * Calculate SM-2 quality rating based on the learning mode
 * 
 * This is the recommended function to use for calculating quality ratings.
 * It delegates to the appropriate mode-specific function based on the selected mode.
 * 
 * Each mode has its own scoring logic:
 * - Typing: Based on response time (fast = quality 5, slow = quality 3-4)
 * - Swipe: Binary self-assessment (user knew it = quality 5, didn't = quality 1)
 * - Fill-in: Based on percentage of correct blanks (100% = quality 5, scales down to quality 2)
 * 
 * Wrong answers always return quality 1 (not 0, since the user saw the answer).
 * 
 * @param mode - The learning mode ('typing', 'swipe', or 'fillIn')
 * @param data - Mode-specific answer data (isCorrect is required, mode-specific fields are optional)
 * @returns Quality rating 0-5
 */
export function getQualityForMode(mode: LearningModeType, data: ModeAnswerData): number {
    if (!data.isCorrect) {
        // Wrong answers always get a low quality (but not 0, since they saw the answer)
        return 1
    }

    switch (mode) {
        case 'typing':
            return getTypingQuality(data)
        case 'swipe':
            return getSwipeQuality(data)
        case 'fillIn':
            return getFillInQuality(data)
        default:
            return 4 // Default
    }
}

/**
 * Typing mode: Quality based on response time
 * Fast answers = high quality (5), slow but correct = lower quality (3)
 */
function getTypingQuality(data: ModeAnswerData): number {
    if (data.responseTimeMs === undefined) {
        return 4 // Default if no timing
    }

    // Fast response: < 3s = quality 5 (instant recall)
    // Medium response: 3-8s = quality 4 (some hesitation)
    // Slow response: > 8s = quality 3 (correct but effortful)
    if (data.responseTimeMs < 3000) {
        return 5
    } else if (data.responseTimeMs < 8000) {
        return 4
    } else {
        return 3
    }
}

/**
 * Swipe mode: Binary self-assessment
 * User decides with confidence - "I knew it" = quality 5, "I didn't" = quality 1
 * This mode trusts the user's self-assessment completely
 */
function getSwipeQuality(data: ModeAnswerData): number {
    // Swipe is binary: if they swiped "correct", they're confident
    // We give a high score since they self-assessed
    return data.isCorrect ? 5 : 1
}

/**
 * Fill-in mode: Quality based on percentage of blanks filled correctly
 * 
 * Quality mapping:
 * - 100% correct = quality 5 (all blanks correct)
 * - 80-99% correct = quality 4 (most blanks correct)
 * - 50-79% correct = quality 3 (half or more correct)
 * - 1-49% correct = quality 2 (some correct, mostly wrong)
 * - 0% correct = quality 1 (all wrong)
 */
function getFillInQuality(data: ModeAnswerData): number {
    if (data.correctBlanks === undefined || data.totalBlanks === undefined || data.totalBlanks === 0) {
        return data.isCorrect ? 4 : 1
    }

    const percentage = data.correctBlanks / data.totalBlanks

    if (percentage === 1) {
        return 5 // All blanks correct
    } else if (percentage >= 0.8) {
        return 4 // Most blanks correct (80%+)
    } else if (percentage >= 0.5) {
        return 3 // Half or more correct
    } else if (percentage > 0) {
        return 2 // Some correct, mostly wrong
    } else {
        return 1 // All wrong
    }
}

/**
 * Get the mastery level based on repetitions and interval
 * Used for visual indicators and progress tracking
 */
export type MasteryLevel = 'new' | 'learning' | 'review' | 'mastered'

export function getMasteryLevel(repetitions: number, interval: number): MasteryLevel {
    if (repetitions === 0 && interval === 0) {
        return 'new'
    } else if (repetitions < 3) {
        return 'learning'
    } else if (interval < 21) {
        return 'review'
    } else {
        return 'mastered'
    }
}

/**
 * Get human-readable description of next review
 */
export function getNextReviewText(nextReview: number): string {
    const now = Date.now()
    const diff = nextReview - now

    if (diff <= 0) {
        return 'Due now'
    }

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) {
        return days === 1 ? 'Tomorrow' : `In ${days} days`
    } else if (hours > 0) {
        return hours === 1 ? 'In 1 hour' : `In ${hours} hours`
    } else {
        return minutes <= 1 ? 'In a few minutes' : `In ${minutes} minutes`
    }
}

/**
 * Check if a card is due for review
 */
export function isDue(nextReview: number): boolean {
    return nextReview <= Date.now()
}
