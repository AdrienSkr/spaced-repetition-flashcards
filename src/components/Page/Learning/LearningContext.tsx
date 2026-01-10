import { createContext, FunctionComponent } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export type LearningMode = 'typing' | 'swipe' | 'fillIn'

const LEARNING_MODE_KEY = 'pairwise_learning_mode'

interface LearningContextType {
  learningMode: LearningMode
  setLearningMode: (mode: LearningMode) => void
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

  // Save learningMode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(LEARNING_MODE_KEY, learningMode)
  }, [learningMode])

  // Wrapper function to update both state and localStorage
  const setLearningMode = (mode: LearningMode) => {
    setLearningModeState(mode)
  }

  return (
    <LearningContext.Provider
      value={{ learningMode, setLearningMode }}
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

