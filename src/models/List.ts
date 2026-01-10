/**
 * Tolerance level for answer validation
 * - exact: 100% match required
 * - tolerant80: 80% similarity accepted
 * - tolerant60: 60% similarity accepted (very lenient)
 */
export type ToleranceLevel = 'exact' | 'tolerant80' | 'tolerant60'

export interface List {
  id?: number
  title: string
  toleranceLevel?: ToleranceLevel
}

