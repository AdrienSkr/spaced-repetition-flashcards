import { Card as CardType } from '../../../../models/Card'
import { ModeAnswerData } from '../../../../utils/sm2'
import { Card } from './Card'
import { SwipeCard } from './SwipeCard'
import { FillInCard } from './FillInCard'
import { useLearningContext } from '../LearningContext'

interface Props {
  card: CardType
  listId: number
  onAnswer: (card: CardType, answerData: ModeAnswerData) => void
  onCardUpdated?: () => void
}

/**
 * Container that renders the appropriate card component based on learning mode
 */
export function CardContainer({ card, listId, onAnswer, onCardUpdated }: Props) {
  const { learningMode } = useLearningContext()

  switch (learningMode) {
    case 'swipe':
      return <SwipeCard card={card} listId={listId} onAnswer={onAnswer} onCardUpdated={onCardUpdated} />
    
    case 'fillIn':
      return <FillInCard card={card} listId={listId} onAnswer={onAnswer} onCardUpdated={onCardUpdated} />
    
    case 'typing':
    default:
      return (
        <Card 
          card={card} 
          listId={listId} 
          onAnswer={onAnswer} 
          onCardUpdated={onCardUpdated} 
        />
      )
  }
}


