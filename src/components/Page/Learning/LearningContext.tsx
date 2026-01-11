import { createContext, FunctionComponent } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export type LearningMode = 'typing' | 'swipe' | 'fillIn'

// Free practice mode types
export type FreePracticeMode = 'off' | 'all' | 'future'

const LEARNING_MODE_KEY = 'pairwise_learning_mode'

interface LearningContextType {
  learningMode: LearningMode
  setLearningMode: (mode: LearningMode) => void
  // Free practice mode
  freePracticeMode: FreePracticeMode
  freePracticeDaysAhead: number
  startFreePractice: (mode: 'all' | 'future', daysAhead?: number) => void
  stopFreePractice: () => void
  isFreePractice: boolean
}

export const LearningContext = createContext<LearningContextType | undefined>(
  undefined,
)

export const LearningProvider: FunctionComponent = ({ children }) => {
  // Initialize learningMode from localStorage
  const [learningMode, setLearningModeState] = useState<LearningMode>(() => {
    const savedMode = localStorage.getItem(LEARNING_MODE_KEY)
    if (savedMode === 'typing' || savedMode === 'swipe' || savedMode === 'fillIn') {
      return savedMode as LearningMode
    }
    return 'typing'
  })

  // Free practice mode state
  const [freePracticeMode, setFreePracticeMode] = useState<FreePracticeMode>('off')
  const [freePracticeDaysAhead, setFreePracticeDaysAhead] = useState<number>(1)

  // Save learningMode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(LEARNING_MODE_KEY, learningMode)
  }, [learningMode])

  // Wrapper function to update both state and localStorage
  const setLearningMode = (mode: LearningMode) => {
    setLearningModeState(mode)
  }

  // Start free practice mode
  const startFreePractice = (mode: 'all' | 'future', daysAhead: number = 1) => {
    setFreePracticeMode(mode)
    setFreePracticeDaysAhead(daysAhead)
  }

  // Stop free practice mode
  const stopFreePractice = () => {
    setFreePracticeMode('off')
    setFreePracticeDaysAhead(1)
  }

  const isFreePractice = freePracticeMode !== 'off'

  return (
    <LearningContext.Provider
      value={{
        learningMode,
        setLearningMode,
        freePracticeMode,
        freePracticeDaysAhead,
        startFreePractice,
        stopFreePractice,
        isFreePractice,
      }}
    >
      {children}
    </LearningContext.Provider>
  )
}

export const useLearningContext = () => {
  const context = useContext(LearningContext)
  if (context === undefined) {
    throw new Error('useLearningContext must be used within a LearningProvider')
  }
  return context
}

