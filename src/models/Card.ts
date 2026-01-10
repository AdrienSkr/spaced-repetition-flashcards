import { SM2CardData } from '../utils/sm2'

/**
 * Card model with SM-2 spaced repetition data
 */
export interface Card extends SM2CardData {
  id?: number
  question: string
  answer: string
  listId: number
  /** @deprecated Use SM2 data instead */
  delay?: number
  /** @deprecated Use SM2 data instead */
  count?: number
}
